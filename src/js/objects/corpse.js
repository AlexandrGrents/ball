import Ball from './ball.js'
import Seed from './seed.js'

class Corpse extends Ball
{
	constructor(deadAnimal)
	{
		super(Object.assign(deadAnimal, {pos: deadAnimal, color: '#c49d00', speed: 0}));
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
		if (this.app.debug) console.log('delete', this)
		if (this.sustenance === 0) this.app.register(Seed.fromCorse(this));
		this.sustenance = 0;
		super.delete();
	}
}

export default Corpse