import Animal from './animal.js'

class Hunter extends Animal
{
	static foodType = new Set(['gatherer', 'corpse']);
	constructor(options)
	{
		// super({app: options.app, pos: options.pos, r: 30, speed: 7, color: '#ab0000'});
		super(Object.assign(options, {r: 30, speed: 7, color: '#ab0000', viewRange: 2}));
		this.power = 350;
		this.type = 'hunter';
		this.powerForMove = 1
		this.powerForSatiety = 1300;
		this.countForPregnant = 20;
	}
	get powerForReproduction()
	{
		if (this.gender === 'male') 
		{
			return 450;
		}
		else
		{
			return 600;
		}
	}
}

export default Hunter
