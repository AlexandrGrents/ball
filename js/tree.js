import Ball from './ball.js'

class Tree extends  Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 15, speed:0, color: '#00ff00'});
		this.type = 'tree';
		this.sustenance = 100;
	}
}
export default Tree