import Ball from './ball.js'

class Tree extends  Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 15, diraction: {dx:0, dy:0}, color: '#00ff00'});
		this.canMove = false;
		this.type = 'tree';
	}
}
export default Tree