let canvas = document.getElementById("сanvas");
console.log(canvas);
let w = parseInt(canvas.width);
let h = parseInt(canvas.height);
let folowingMode = false;

let ctx = canvas.getContext("2d");
ctx.w = w;
ctx.h = h;

let x = canvas.width-30;
let y = canvas.height-30;
let maxSpeed = 5;
let r = 10;
let dx = 2;
let dy = -2;
let probably = 0.2;

let balls = [];

let colors = ['#0095DD', '#30fc30', '#c2c92e', '#fc8de8', '#ab0000', '#00a39e'];

let lastMousePos = false;

function render() 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let ball of balls)
		ball.move()
}

class Ball{
	constructor(options)
	{
		this.ctx = options.ctx;

		this.x = options.pos.x;
		this.y = options.pos.y;
		
		this.dx = options.diraction.x;
		this.dy = options.diraction.y;

		this.r = 10;
		this.color = options.color;
	}
	draw()
	{
		this.ctx.beginPath();
	    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
	    this.ctx.fillStyle = this.color;
	    this.ctx.fill();
	    this.ctx.closePath();
	}
	move()
	{
		this.draw();
		if (Math.random() < probably && !folowingMode) this.randomChangeDiraction();
		if (folowingMode)
		{
			this.follow();
		}
		this.changeDiraction();
		
	}
	follow()
	{
		if (!lastMousePos) return;
		let x = lastMousePos.x;
		let y = lastMousePos.y;
		if (this.x > x && this.dx > 0) this.dx *=-1;
		if (this.x < x && this.dx < 0) this.dx *=-1;

		if (this.y > y && this.dy > 0) this.dy *=-1;
		if (this.y < y && this.dy < 0) this.dy *=-1;
	}
	randomChangeDiraction()
	{
		dx = this.dx + getRandomInt(-2,2);
		dy = this.dy + getRandomInt(-2,2);
		if (dx && dy && Math.abs(dx) <=maxSpeed && Math.abs(dy) <=maxSpeed)
		{
			this.dx = dx;
			this.dy = dy;
		}
	}
	changeDiraction()
	{
		this.x += this.dx;
		this.y += this.dy;

		if (this.x <= this.r)
		{
			this.x = this.r;
			this.dx *= -1;
		} 
		if (this.x >= (this.ctx.w - this.r))
		{
			this.x = this.ctx.w - this.r;
			this.dx *= -1;
		}
		if (this.y <= this.r) 
		{
			this.y = this.r;
			this.dy *= -1;
		}
		if (this.y >= (this.ctx.h - this.r)) 
		{
			this.y = this.ctx.h - this.r;
			this.dy *= -1;
		}
	}
}

balls.push(new Ball({ctx, pos: {x,y}, diraction: {x: dx, y:dy}, color: colors[0]}));

function getRandomInt(max, min = 0) { 
	return Math.floor(Math.random() * (max - min)) + min; 
}

function addRandomBall()
{
	let x = getRandomInt(w-r, r);
	let y = getRandomInt(h-r, r);
	let dx = getRandomInt(5, 1) * (1 - 2 * getRandomInt(2, 0));
	let dy = getRandomInt(5, 1) * (1 - 2 * getRandomInt(2, 0));
	let color = colors[Math.floor(Math.random()*6)];
	balls.push(new Ball({ctx, pos: {x,y}, diraction: {x: dx, y:dy}, color}));
}

function changeCanvasGeomenryOnEvent(event)
{
	if (event.pageX < (4*r) || event.pageY < (4*r)) return;
	canvas.width = event.pageX;
	canvas.height = event.pageY;
	ctx.w = event.pageX;
	ctx.h = event.pageY;
}

document.getElementById('add').onclick = addRandomBall
document.getElementById('addx5').onclick = () => {for (let i =0; i<5; i++) addRandomBall()}
document.getElementById('clear').onclick = () => balls = [];
document.getElementById('standart-geometry').onclick = () =>  changeCanvasGeomenryOnEvent({pageX:480, pageY: 320});

document.getElementById('following-mode').onclick = (event) =>
{
	folowingMode = !folowingMode;
	event.target.className = folowingMode ? 'active' : 'deactive';
	event.target.innerHTML = folowingMode ? 'Выключить мод "преследования мыши"' : 'Включить мод "преследования мыши"';
	if (folowingMode)
	document.onmousemove = (event) =>
	{
		lastMousePos = (event.pageX < canvas.width && event.pageY < canvas.height) ?  {x: event.pageX, y: event.pageY} : false;

	};
	else 
	{
		canvas.onmousedown = null;
		lastMousePos = false;
		canvas.onmousedown = (event) =>
		{
			if (folowingMode) return;
			changeCanvasGeomenryOnEvent(event);
			document.onmousemove = changeCanvasGeomenryOnEvent;
			document.onmouseup = () => 	document.onmousemove = null;
		};
	}
}

canvas.onmousedown = (event) =>
{
	if (folowingMode) return;
	changeCanvasGeomenryOnEvent(event);
	document.onmousemove = changeCanvasGeomenryOnEvent;
	document.onmouseup = () => 	document.onmousemove = null;
};

setInterval(render, 20);