import Ball from './ball.js'
import Corpse from './corpse.js'

class Hunter extends Ball
{
	static foodType = new Set(['gatherer', 'corpse']);
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 30, speed: 6, color: '#ab0000'});
		this.power = 400;
		this.type = 'hunter';
		this.probably = 0.02;
		this.powerForReproduction = 300;
	}
	move()
	{
		if (this.power <=0 || Math.random()<(0.01/this.power)) return this.dead();
		this.power -=1;
		if (Math.random() < this.probably) this.defineRandomDiraction();
		if (this.power > 2 * this.powerForReproduction && this.app.reproductionMode) this.reproduction();
		this.find();
		super.move();
	}
	find()
	{
		let foods = new Set();
		for (let ball of this.app.sectors.get(this.sector))
		{
			if (Hunter.foodType.has(ball.type))
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
	reproduction()
	{
		this.power -= this.powerForReproduction;
		this.app.addElems(this.type, 1, [{x: this.x, y:this.y}]);

	}
	eat(food)
	{
		this.power = food.sustenance ? this.power + food.sustenance: 200 + Math.floor(food.power / 2);
		food.delete();
		this.defineRandomDiraction();
	}
	dead()
	{
		this.app.register(new Corpse(this));
		this.delete();
	}
}

export default Hunter
