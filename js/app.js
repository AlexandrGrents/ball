import Ball from './objects/ball.js'
import Seed from './objects/seed.js'
import Tree from './objects/tree.js'
import Gatherer from './objects/gatherer.js'
import Hunter from './objects/hunter.js'

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
		this.maxSectors = this.perX * this.perY;

		this.r = 20;
		this.probably = 0.2;
		this.balls = new Set();

		
		this.trees = new Set();
		this.seeds = new Set();
		this.gatherers = new Set();
		this.hunters = new Set();
		this.corpses = new Set();

		this.sectors = new Array(this.perX * this.perY);
		for (let i =0; i<this.sectors.length; i++) this.sectors[i] = new Set();

		this.showSectors = options.showSectors ? options.showSectors: false;
		this.reproductionMode = options.reproductionMode ? options.reproductionMode: false;



		this.animalPopulationLimit = options.animalPopulationLimit ? options.animalPopulationLimit : 100;
		this.treePopulationLimit = options.treePopulationLimit ? options.treePopulationLimit : 1900;
		

		this.showViewRanges = options.showViewRanges ? options.showViewRanges: false;

		this.hashedSectors = new Map();

		this.logger = {
			'trees': [],
			'gatherers': [],
			'hunters': []
		}

		this.score = 0;
		this.scoreStep = 50;

		this.updateCount = 0;

		this.addClicker = (pos) => console.log('add clicker on', {x: pos.x, y:pos.y})
	}

	addScore()
	{
		this.score += this.scoreStep;
		return this.score;
	}

	get allPopulationLimit() {return this.animalPopulationLimit + this.treePopulationLimit;}

	get limit ()
	{
		if (this.animalLimit && this.treeLimit) return true;
		return (this.trees.size + this.seeds.size + this.gatherers.size + this.hunters.size > this.allPopulationLimit)
	}

	get animalLimit()	{ return (this.gatherers.size + this.hunters.size > this.animalPopulationLimit)	}

	get treeLimit()	{ return (this.trees.size + this.seeds.size> this.treePopulationLimit) }

	
	register(ball)
	{
		if (this.debug) console.log('register', ball)
		this.balls.add(ball);
		this.sectors[ball.sector].add(ball);
		switch (ball.type)
		{
			case 'seed':
				this.seeds.add(ball);
				break;
			case 'tree':
				this.trees.add(ball);
				break;
			case 'gatherer':
				this.gatherers.add(ball);
				break;
			case 'hunter':
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
		this.sectors[ball.sector].delete(ball);
		switch (ball.type)
		{
			case 'seed':
				this.seeds.delete(ball);
				break;
			case 'tree':
				this.trees.delete(ball);
				break;
			case 'gatherer':
				this.gatherers.delete(ball);
				break;
			case 'hunter':
				this.hunters.delete(ball)
			case 'corpse':
				this.corpses.delete(ball);
				break;
		}
	}

	getHashedSectorNumbers(n, viewRange)
	{
		return this.hashedSectors.get({n, viewRange});
	}


	setHashedSectorNumbers(n, viewRange, sectors)
	{
		this.hashedSectors.set({n, viewRange}, sectors);
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

	addElems(type, n, poss = null, gender = null)
	{
		let positions = poss ? poss: this.getRandomPositions(n);
		let ball;
		for (let pos of positions)
		{
			if (this.limit) break;
			if (this.animalLimit && (type === 'gatherer' || type === 'hunter')) break;
			if (this.treeLimit && (type === 'tree' || type === 'seed')) break;

			if (pos.x < 10) pos.x = 10;
			if (pos.y < 10) pos.y = 10;
			if (pos.x > this.w - 10) pos.x = this.w - 10;
			if (pos.y > this.h - 10) pos.y = this.h - 10;
			switch (type)
			{
				case 'seed':
					ball = new Seed({app: this, pos});
					break;
				case 'tree':
					ball = new Tree({app: this, pos});
					break;
				case 'gatherer':
					ball = new Gatherer({app: this, pos, gender});
					break;
				case 'hunter':
					ball = new Hunter({app: this, pos, gender});
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
		this.ctx.fillStyle = '#000000';
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
			for (let x = 0; x < this.perY; x++)
			{
				this.ctx.fillText(Math.floor(this.perX*y/dy) + x, x * dx + 3 , y + 12);

			}
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
		this.updateCount++;
		this.movingBalls()
		this.updateLogger()
		this.render()
	}

	updateLogger()
	{
		if (this.updateCount % 10 != 0) return
		for (let type in this.logger)
		{
			if (this.debug) console.log('update logger [type of log]', type, this.logger)
			this.logger[type].push(this[type].size);
		}
	}

	stopRender()
	{
		clearInterval(this.processRenderId);
	}

	changeSector(sector, ball)
	{
		if (sector === ball.sector) return;
		
		this.sectors[ball.sector].delete(ball);
		this.sectors[sector].add(ball);		
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