import Ball from './ball.js'
import Corpse from './corpse.js'

class Gatherer extends Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 20, speed: 5, color: '#0095DD'});
		this.canMove = true;
		this.power = 100;
		this.type = 'gatherer';
		this.probably = 0.02;
	}
	move()
	{
		if (this.power <=0 || Math.random()<(0.01/this.power)) return this.dead();
		this.power -=1;
		if (Math.random() < this.probably) this.defineRandomDiraction();
		this.find();
		super.move();
	}
	find()
	{
		let trees = new Set();
		for (let ball of this.app.sectors.get(this.sector).values())
		{
			if (ball.type === 'tree' || ball.type === 'corpse')
			{

				if (Math.abs(this.x - ball.x) <5 && Math.abs(this.y - ball.y) < 5)
				{
					this.eat(ball);
				}
				else
				{
					trees.add(ball);
				}
			}	
		}
		let nearestTree, minDist = null, dist;
		for (let tree of trees.values())
		{
			dist = this.calcDistFor({x:tree.x, y: tree.y})
			if (minDist === null || minDist > dist)
			{
				minDist = dist;
				nearestTree = tree;
			}
		}
		if (minDist !== null) this.changeDiractionFor({x:nearestTree.x, y:nearestTree.y});
	}
	eat(food)
	{
		this.app.sectors.get(food.sector).delete(food);
		this.app.balls.delete(food);
		this.power += food.sustenance;
		this.defineRandomDiraction();
	}
	dead()
	{
		this.app.balls.add( new Corpse(this));
		this.app.sectors.get(this.sector).delete(this);
		this.app.balls.delete(this);
		this.app.gatherers.delete(this);
	}

}

export default Gatherer