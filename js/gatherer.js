import Ball from './ball.js'

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
		if (this.power <=0) return;
		this.power -=1;
		if (Math.random() < this.probably) this.defineRandomDiraction();
		this.find();
		super.move();
	}
	find()
	{
		let trees = new Set();
		console.log(this.sector, this.app.sectors.get(this.sector));
		for (let ball of this.app.sectors.get(this.sector).values())
		{
			if (ball.type === 'tree')
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
			console.log(tree)
			dist = this.calcDistFor({x:tree.x, y: tree.y})
			if (minDist === null || minDist > dist)
			{
				minDist = dist;
				nearestTree = tree;
			}
		}
		if (minDist !== null) this.changeDiractionFor({x:nearestTree.x, y:nearestTree.y});
	}
	eat(tree)
	{
		this.app.sectors.get(tree.sector).delete(tree);
		this.app.balls.delete(tree);
		this.power += 100;
		console.log('eat', this.power);
		this.defineRandomDiraction();
	}
	

}

export default Gatherer