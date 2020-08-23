import Ball from './ball.js'

class Corpse extends Ball
{
	constructor(deadAnimal)
	{
		super({app: deadAnimal.app, 
			pos: {x: deadAnimal.x, y: deadAnimal.y}, 
			r: deadAnimal.r, color: '#c49d00', speed: 0});
		this.type = 'corpse';
		this.sustenance = deadAnimal.type === 'gatherer' ? 100 : 200;
		this.sustenance += Math.floor(deadAnimal.power / 2);
		this.sustenanceForFrame = 1;
	}
	move()
	{
		if (this.sustenance <= 0 ) return this.delete();
		this.sustenance-= this.sustenanceForFrame;
		super.move();
	}
	delete()
	{
		this.sustenance = 0;
		super.delete();
	}
}

export default Corpse