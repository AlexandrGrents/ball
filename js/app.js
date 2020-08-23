import Ball from './ball.js'
import Tree from './tree.js'
import Gatherer from './gatherer.js'
import Hunter from './hunter.js'

class Application
{
	constructor(options)
	{

		this.canvas = options.canvas;
		this.scoreLabel = options.scoreLabel;
		console.log(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = "12px Verdana";
		this.w = parseInt(this.canvas.width);
		this.h = parseInt(this.canvas.height);

		this.perX = 5;
		this.perY = 5;

		this.r = 20;
		this.probably = 0.2;
		this.balls = new Set();
		this.gatherers = new Set();

		this.sectors = new Map();
		for (let i =0; i<this.perX * this.perY; i++) this.sectors.set(i,new Set());
		console.log('map',this.sectors);

		// this.addForest([{x:250, y:150}, {x:250, y:250}, {x:450, y:100}, {x:300, y:180}]);
		this.addRandomForest(30);
		for (let i =0; i<5; i++) this.addGatherer({x:100 + 40* i, y:100 + 20* i}); 
		// this.addHunter({x:250, y:300}, {dx:1, dy:1})

	}
	addBall(options)
	{
		this.balls.add(new Ball({app: this, pos: options.pos, r: this.r, diraction: options.diraction}));
	}
	addGatherer(pos)
	{
		let gatherer = new Gatherer({app: this, pos})
		this.balls.add(gatherer)
		this.gatherers.add(gatherer)
	}
	addHunter(pos, diraction)
	{
		this.balls.add(new Hunter({app: this, pos, diraction}))
	}
	addRandomForest(n)
	{
		let positions = [], x, y;
		for (let i = 0; i<n; i++)
		{
			x = 20 + Math.random()*(this.w - 40);
			y = 20 + Math.random()*(this.h - 40);
			positions.push({x, y});
		}
		this.addForest(positions);
	}
	addForest(positions)
	{
		for (let pos of positions)
			this.balls.add(new Tree({app: this, pos}));
	}
	addRandomBall()
	{
		let x = getRandomInt(this.w - this.r, this.r);
		let y = getRandomInt(this.h - this.r, this.r);
		let dx = getRandomInt(5, 1) * (1 - 2 * getRandomInt(2, 0));
		let dy = getRandomInt(5, 1) * (1 - 2 * getRandomInt(2, 0));

		this.addBall({pos:{x,y}, diraction:{dx,dy}});
	}
	removeBalls()
	{
		this.balls = new Set();
	}

	movingBalls()
	{
		for (let ball of this.balls.values()) ball.move()
	}
	renderSectors()
	{
		this.ctx.beginPath();
		let dx = Math.floor(this.w/this.perX);
		let dy = Math.floor(this.h/this.perY);

		for (let x =0; x<this.w; x+= dx)
		{
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, this.h);
		}
		for (let y = 0; y < this.h; y+= dy)
		{
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(this.w, y);
		}
		this.ctx.stroke();  
		this.ctx.closePath();
	}

	render()
	{	
		let sumPower = 0;
		this.movingBalls();
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.renderSectors();
		for (let ball of [...this.balls].sort(Ball.compareFunction))
		{
			ball.draw();
			if (ball.type === 'gatherer')
			{
				sumPower += ball.power;
			}
		}
		this.scoreLabel.innerText = sumPower;

	}
	stopRender()
	{
		clearInterval(this.processRenderId);
	}
	changeSector(sector, ball)
	{
		if (sector === ball.sector) return;
		
		this.sectors.get(ball.sector).delete(ball);
		this.sectors.get(sector).add(ball);		
	}
}

function getRandomInt(max, min = 0) { 
	return Math.floor(Math.random() * (max - min)) + min; 
}

export default Application