import Ball from './ball.js'

class Hunter extends Ball
{
	constructor(options)
	{
		super({app: options.app, pos: options.pos, r: 30, diraction: options.diraction, color: '#ab0000'});
		this.canMove = true;
		this.type = 'hunter';
	}
}

export default Hunter