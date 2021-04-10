import Animal from './animal.js'

class Hunter extends Animal
{
	static foodType = new Set(['gatherer', 'corpse']);
	constructor(options)
	{
		// super({app: options.app, pos: options.pos, r: 30, speed: 7, color: '#ab0000'});
		super(Object.assign(options, {r: 30, speed: 7, color: '#ab0000', viewRange: 5, countForPregnant: 100, countForAfterPregant: 300}));
		this.power = 350;
		this.type = 'hunter';
		this.powerForMove = 1
	}
	get powerForReproduction()
	{
		let power = (this.gender === 'male')  ? 200 : 300;
		return power;
	}
	get powerForSatiety()
	{
		let power = (this.gender === 'male')  ? 600 : 900;
		return power;
	}
}

export default Hunter
