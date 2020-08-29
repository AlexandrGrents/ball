import Ball from './ball.js'
import Tree from './tree.js'

class Seed extends Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 3, speed:0, color: '#35694f'});
		this.type = 'seed';
		this.sustenance = 1;
		this.sustenanceForTransformation = 50;
		this.sustenancePerMove = 1;
		this.probably = 0.2;
	}
	move()
	{
		if (Math.random() < this.probably) this.sustenance += this.sustenancePerMove;
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