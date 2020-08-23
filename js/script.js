import Application from './app.js';

let fps = parseInt(document.getElementById('speed').value);
let pauseActive = false;
let secForForest = Math.floor(200/fps);
let i = secForForest;

let app = new Application({canvas: document.getElementById('сanvas'), scoreLabel: document.getElementById('score')});
globalThis.app = app;

let forestProcId = setInterval( () => {
	let newTreeCount = document.getElementById('forest').value;
	app.addRandomForest(newTreeCount);
	i = secForForest;
}, 1000 * secForForest);


let procId = setInterval(() => {if (!pauseActive) app.render()}, Math.floor(1000/fps))

document.getElementById('speed').onchange = (event) =>
{
	clearInterval(procId);
	clearInterval(forestProcId);
	fps = parseInt(event.target.value);
	secForForest = Math.floor(200/fps);

	document.getElementById('total-time').innerText = secForForest;

	procId = setInterval(() => {if (!pauseActive) app.render()}, Math.floor(1000/fps))
	forestProcId = setInterval( () => {
		let newTreeCount = document.getElementById('forest').value;
		app.addRandomForest(newTreeCount);
		i = secForForest;
	}, 1000 * secForForest);
}

document.getElementById('add-power').onclick = () =>
{
	for (let gatherer of app.gatherers) gatherer.power += 100;
}

document.getElementById('add-gatherer').onclick = () =>
{
	app.addGatherer({x:100, y: 100});
}

document.getElementById('pause').onclick = () => 
{
	pauseActive = !pauseActive;
	document.getElementById('pause').innerText = pauseActive ? 'Подолжить' : 'Пауза'
}

setInterval( () => {
	document.getElementById('timer').innerText = i; 
	i = (secForForest + i - 1) % secForForest
}, 1000);