import Ball from './ball.js'
import Seed from './seed.js'

class Tree extends  Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 15, speed:0, color: '#00ff00'});
		this.type = 'tree';
		this.sustenance = 30;
		this.maxSustenance = 500;
		this.sustenancePerMove = 1;
		this.sustenanceForReplication = 10;
		this.reproductionMinRange = 50;
		this.reproductionMaxRange = 300;
		this.probably = 0.05;
		this.reproductionMinCount = 3;
		this.reproductionMaxCount = 10;
		this.age = 0;
	}
	get isWantReplication()
	{
		return !this.app.treeLimit && this.sustenance > this.reproductionMaxCount * this.sustenanceForReplication && this.app.reproductionMode
	}
	grow()
	{
		if (this.sustenance >= this.maxSustenance) return
		let treeAround = false;
		for (let ball of this.app.sectors.get(this.sector))
		{
			if (ball.type === this.type && ball !==this || ball.type === 'seed')
			{
				treeAround = true;
				break;
			}
		}
		if (!treeAround || Math.random() < this.probably) this.sustenance += this.sustenancePerMove;
		this.r = 14 + this.sustenance/50;
	}
	move()
	{
		this.age++;
		this.grow();
		if (this.isWantReplication) this.replication();
		super.move()
	}
	replication()
	{
		let reproductionCount = Math.round(Math.random() * (this.reproductionMaxCount - this.reproductionMinCount)) + this.reproductionMinCount;
		this.sustenance -= this.sustenanceForReplication * reproductionCount;
		let pos, Dx, Dy, d, x, y, D;

		

		for (let i =0; i< reproductionCount-1; i++)
		{
			pos = this.getRandomPos();
			Dx = pos.x - this.x;
			Dy = pos.y - this.y;
			d = Math.sqrt(Dx**2 + Dy**2);
			D = Math.round(Math.random() * (this.reproductionMaxRange - this.reproductionMinRange)) + this.reproductionMinRange;
			x = this.x + Dx * D / d;
			y = this.y + Dy * D / d;
			this.app.addElems('seed', 1, [{x, y}]);
		}
		this.app.addElems('seed', 1, [{x: this.x, y: this.y}]);

		
	}
}
export default Tree