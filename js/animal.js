import Ball from './ball.js'
import Corpse from './corpse.js'

class Animal extends Ball
{
	static foodType = new Set();
	static maleColor = '#03fce3';
	static femaleColor = '#f500b4';
	constructor(options)
	{
		super(options);
		if (options.gender)
		{
			this.gender = options.gender;	
		}
		else
		{
			this.gender = Math.random()>0.5 ? 'male' : 'female';	
		}

		this.viewRange = options.viewRange ? options.viewRange : 1;
		
		this.probably = 0.02;
		this.age = 0;
	}
	move()
	{
		this.age++;
		if (this.power <=0 || Math.random()<(0.001*this.age/(10*this.power))) return this.dead();
		this.power -=this.powerForMove;
		if (Math.random() < this.probably) this.defineRandomDiraction();
		if (this.power > 2 * this.powerForReproduction && this.app.reproductionMode) this.reproduction();
		this.find();
		super.move();
	}

	get viewSectorNumbers ()
	{
		let sectorNumbers = this.app.getHashedSectorNumbers(this.sector, this.viewRange);
		if (sectorNumbers !== undefined) return sectorNumber;


		sectorNumbers = new Set([this.sector]);
		let x = Math.floor(this.sector % this.app.perX);
		let y = Math.floor(this.sector / this.app.perX);
		let sector_x, sector_y;
		for (let i = this.viewRange; i>=-this.viewRange; i--)
		{
			sector_x = x + i;
			if (sector_x <0 || sector_x >= this.app.perY) continue;
			for (let j = this.viewRange - Math.abs(i); j >= Math.abs(i) - this.viewRange; j--)
			{
				sector_y = y + j;
				if (sector_y <0 || sector_y >= this.app.perX) continue;
				sectorNumbers.add(sector_x + sector_y * this.app.perX);
			}
		}
		this.app.setHashedSectorNumbers(this.sector, this.viewRange, sectorNumbers);
		return sectorNumbers;
	}

	find()
	{
		let foods = new Set();
		for (let sectorNumber of this.viewSectorNumbers)
		{
			for (let ball of this.app.sectors.get(sectorNumber))
			{
				if (this.__proto__.constructor.foodType.has(ball.type))
				{
					if (Math.abs(this.x - ball.x) <5 && Math.abs(this.y - ball.y) < 5) this.eat(ball);
					else foods.add(ball);
				}	
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
		let gender = Math.random()>0.5 ? 'male' : 'female';
		this.power -= this.powerForReproduction;
		this.app.addElems(this.type, 1, [{x: this.x, y:this.y}], gender);

	}
	eat(food)
	{
		this.power = food.sustenance ? this.power + food.sustenance : this.power + 100 + Math.floor(food.power / 4);
		food.delete();
	}
	dead()
	{
		this.app.register(new Corpse(this));
		this.delete();
	}

	draw()
	{
		let color = (this.gender ==='male') ? Animal.maleColor : Animal.femaleColor;
		super.draw();
		this.app.ctx.beginPath();
		this.app.ctx.arc(this.x, this.y+12, 5, 0, Math.PI*2);
		this.app.ctx.fillStyle = color;
	    this.app.ctx.fill();
	    if (this.app.showViewRanges)
	    {
	    	this.app.ctx.moveTo(this.x + this.r + + this.viewRange * this.app.perX, this.y)
	    	this.app.ctx.arc(this.x, this.y, this.r + this.viewRange * this.app.perX, 0, Math.PI*2);
	    	this.app.ctx.stroke();
	    }
	    
	    this.app.ctx.closePath();
	}
}

export default Animal
