import Ball from './ball.js'
import Tree from './tree.js'

class Seed extends Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 5, speed:0, color: '#abccb4'});
		this.type = 'seed';
		this.sustenance = 1;
		this.sustenanceForTransformation = 50;
		this.sustenancePerMove = 1;
		this.probably = 0.2;
	}

	static fromCorse(corse)
	{
		return new Seed({app: corse.app, pos: corse});
	}

	move()
	{
		if (Math.random() < this.probably) this.sustenance += this.sustenancePerMove;
		this.r = 5 + this.sustenance/5
		if (this.sustenance >= this.sustenanceForTransformation) this.transformation();
		super.move()
	}
	transformation()
	{
		this.app.register(new Tree({app: this.app, pos: {x: this.x, y: this.y}}));
		this.sustenance = 0;
		this.delete();
	}
}
export default Seed