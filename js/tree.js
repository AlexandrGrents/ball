import Ball from './ball.js'

class Tree extends  Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 15, speed:0, color: '#00ff00'});
		this.type = 'tree';
		this.sustenance = 50;
		this.sustenancePerMove = 1;
		this.sustenanceForReplication = 75;
		this.probably = 0.2;
	}
	move()
	{
		if (Math.random() < this.probably) this.sustenance += this.sustenancePerMove;
		if (this.sustenance > 2 * this.sustenanceForReplication && this.app.reproductionMode) this.replication();
		super.move()
	}
	replication()
	{
		this.sustenance -= this.sustenanceForReplication;
		let pos = this.getRandomPos();
		let Dx = pos.x - this.x;
		let Dy = pos.y - this.y;
		let d = Math.sqrt(Dx**2 + Dy**2);

		let x = this.x + Dx * 4 * this.r / d;
		let y = this.y + Dy * 4 * this.r / d;
		this.app.addElems(this.type, 1, [{x, y}]);
	}
}
export default Tree