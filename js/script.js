import Application from './app.js';

let canvas = document.getElementById('сanvas');

let controlsSection = document.getElementById('controls');
let infoSection = document.getElementById('info');

document.getElementById('controls-show').onclick = () => controlsSection.hidden = !controlsSection.hidden
document.getElementById('info-show').onclick = () => infoSection.hidden = !infoSection.hidden

let pauseActive = false;
let pause = document.getElementById('pause');
let addPower = document.getElementById('add-power');
let addGatherer = document.getElementById('add-gatherer');
let addHunter = document.getElementById('add-hunter');


let showSectors = document.getElementById('show-sectors');
let showViewRanges = document.getElementById('show-view-ranges');

let speedSelect = document.getElementById('speed');
let forestSelect = document.getElementById('forest');

let timeLabel = document.getElementById('timer');
let totalTimeLabel = document.getElementById('total-time');

let app = new Application({canvas, sectors: {x:20, y: 20}, showSectors: showSectors.checked, reproductionMode: true, showViewRanges: showViewRanges.checked});
globalThis.app = app;

app.addElems('tree', 100);
app.addElems('gatherer',2, null, 'male');
app.addElems('gatherer',2, null, 'female');
// app.addElems('hunter',1);

let mspf = Math.floor(1000/parseInt(speedSelect.value));
let timeForAddTrees = Math.floor(200*mspf/1000);
let i = timeForAddTrees;
let newTreeCount = parseInt(forestSelect.value);

let renderId = setInterval(() => {if (!pauseActive) app.update()}, mspf)
let addTreesId = setInterval(() => {if (!pauseActive) app.addElems('tree', newTreeCount)}, mspf*200)
let timerId = setInterval(() => timeLabel.change(), 1000);

pause.onclick = (event) => {pauseActive = !pauseActive; event.target.src = pauseActive ? 'images/play-solid.svg' : 'images/pause-solid.svg'};
addPower.onclick = () => {app.addPower('gatherer'); app.render();};
addGatherer.onclick = () => {
	app.populationLimit++;
	app.addElems('gatherer', 1); 
	app.render();
};
addHunter.onclick = () => {
	app.populationLimit++;
	app.addElems('hunter', 1); 
	app.render();
};
showSectors.onclick = (event) => {app.showSectors = event.target.checked; app.render();};
showViewRanges.onclick = (event) => {app.showViewRanges = event.target.checked; app.render();}

timeLabel.change = function(){if (!pauseActive) {this.innerText = i; i = (timeForAddTrees + i - 1) % timeForAddTrees}};
totalTimeLabel.change = function(){if (!pauseActive) {this.innerText = timeForAddTrees}};
speedSelect.onchange = (event) =>
{
	clearInterval(renderId);
	clearInterval(addTreesId);
	mspf = Math.floor(1000/parseInt(event.target.value));
	timeForAddTrees = Math.floor(200*mspf/1000);
	timeLabel.change();
	totalTimeLabel.change();
	renderId = setInterval(() => {if (!pauseActive) app.update()}, mspf)
	addTreesId = setInterval(() => {if (!pauseActive) app.addElems('tree', newTreeCount)}, mspf*200)
}
forestSelect.onchange = (event) => newTreeCount = parseInt(event.target.value)
timeLabel.change();
totalTimeLabel.change();