import Ball from './ball.js'
import Tree from './tree.js'
import Gatherer from './gatherer.js'
import Hunter from './hunter.js'

class Application
{
	constructor(options)
	{

		this.canvas = options.canvas;

		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = "12px Verdana";
		this.w = parseInt(this.canvas.width);
		this.h = parseInt(this.canvas.height);


		this.perX = (options.sectors && options.sectors.x) ? options.sectors.x : 5;
		this.perY = (options.sectors && options.sectors.y) ? options.sectors.y : 5;

		this.r = 20;
		this.probably = 0.2;
		this.balls = new Set();

		this.gatherers = new Set();
		this.trees = new Set();
		this.hunters = new Set();
		this.corpses = new Set();

		this.sectors = new Map();
		for (let i =0; i<this.perX * this.perY; i++) this.sectors.set(i,new Set());
		this.showSectors = options.showSectors ? options.showSectors: false;
		this.reproductionMode = options.reproductionMode ? options.reproductionMode: false;
	}
	
	register(ball)
	{
		this.balls.add(ball);
		this.sectors.get(ball.sector).add(ball);
		switch (ball.type)
		{
			case 'tree':
				this.trees.add(ball);
				break;
			case 'gatherer':
				this.gatherers.add(ball);
				break;
			case 'hunters':
				this.hunters.add(ball);
				break;
			case 'corpse':
				this.corpses.add(ball);
				break;
		}
	}

	unregister(ball)
	{
		this.balls.delete(ball);
		this.sectors.get(ball.sector).delete(ball);
		switch (ball.type)
		{
			case 'tree':
				this.trees.delete(ball);
				break;
			case 'gatherer':
				this.gatherers.delete(ball);
				break;
			case 'hunters':
				this.hunters.delete(ball)
			case 'corpse':
				this.corpses.delete(ball);
				break;
		}
	}

	getRandomPositions(n)
	{
		let positions = [], x, y;
		for (let i = 0; i<n; i++)
		{
			x = 40 + Math.random()*(this.w - 80);
			y = 40 + Math.random()*(this.h - 80);
			positions.push({x, y});
		}
		return positions;
	}

	addElems(type, n, poss = null)
	{
		let positions = poss ? poss: this.getRandomPositions(n);
		let ball;
		for (let pos of positions)
		{
			switch (type)
			{
				case 'tree':
					ball = new Tree({app: this, pos});
					break;
				case 'gatherer':
					ball = new Gatherer({app: this, pos});
					break;
				case 'hunter':
					ball = new Hunter({app: this, pos});
					break;
			}
			this.register(ball);
		}
	}
	
	movingBalls()
	{
		for (let ball of this.balls) ball.move()
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
		this.ctx.clearRect(0, 0, this.w, this.h);
		if (this.showSectors) this.renderSectors();
		for (let ball of [...this.balls].sort(Ball.compareFunction))
		{
			ball.draw();
		}
	}
	update()
	{
		this.movingBalls()
		this.render()
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
	addPower(type)
	{
		switch (type)
		{
			case 'gatherer':
				for (let gatherer of this.gatherers) gatherer.power += 100;
				break;
			case 'hunters':
				for (let hunters of this.hunterss) hunters.power += 100;
				break;
		}
		
	}
}

export default Application