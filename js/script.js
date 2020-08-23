import Application from './app.js';

let fps = 10;
let i = 20;

console.log(document.getElementById('сanvas'));
let app = new Application({canvas: document.getElementById('сanvas'), scoreLabel: document.getElementById('score')});
globalThis.app = app;

setInterval( () => {
	let newTreeCount = document.getElementById('forest').value;
	app.addRandomForest(newTreeCount);
	i = 20;
}, 20000);


let procId = setInterval(app.render.bind(app), Math.floor(1000/fps))

document.getElementById('speed').onchange = (event) =>
{
	clearInterval(procId);
	fps = parseInt(event.target.value);
	procId = setInterval(app.render.bind(app), Math.floor(1000/fps))
}

document.getElementById('add-power').onclick = () =>
{
	for (let gatherer of app.gatherers) gatherer.power += 100;
}

setInterval( () => {
	document.getElementById('timer').innerText = i; 
	i = (i+19)% 20
}, 1000);