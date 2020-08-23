import Ball from './ball.js'
import Corpse from './corpse.js'

class Gatherer extends Ball
{
	static foodType = new Set(['tree']);
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 20, speed: 5, color: '#0095DD'});
		this.power = 100;
		this.type = 'gatherer';
		this.probably = 0.02;
		this.powerForReproduction = 150;
		this.powerForMove = 1;
		this.age = 0;
	}
	move()
	{
		this.age++;
		if (this.power <=0 || Math.random()<(0.001*this.age/(10*this.power))) return this.dead();
		this.power -= this.powerForMove;
		if (Math.random() < this.probably) this.defineRandomDiraction();
		if (this.power > 2 * this.powerForReproduction && this.app.reproductionMode) this.reproduction();
		this.find();
		super.move();
	}
	reproduction()
	{
		this.power -= this.powerForReproduction;
		this.app.addElems(this.type, 1, [{x: this.x, y:this.y}]);

	}
	find()
	{
		let foods = new Set();
		for (let ball of this.app.sectors.get(this.sector))
		{
			if (Gatherer.foodType.has(ball.type))
			{
				if (Math.abs(this.x - ball.x) <5 && Math.abs(this.y - ball.y) < 5) this.eat(ball);
				else foods.add(ball);
			}	
		}
		let nearestFood, minDist = null, dist;
		for (let food of foods)
		{
			dist = this.calcDistFor({x:food.x, y: food.y})
			if (minDist === null || minDist > dist) { minDist = dist; nearestFood = food; }
		}
		if (minDist !== null) this.changeDiractionFor({x:nearestFood.x, y:nearestFood.y});
	}
	eat(food)
	{
		this.power += food.sustenance;
		food.delete();
		this.defineRandomDiraction();
	}
	dead()
	{
		this.app.register(new Corpse(this));
		this.delete();
	}

}

export default Gatherer