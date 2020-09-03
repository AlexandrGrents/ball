import Application from './app.js';

let canvas = document.getElementById('сanvas');

let controlsSection = document.getElementById('controls');
let infoSection = document.getElementById('info');

document.getElementById('controls-show').onclick = () => controlsSection.hidden = !controlsSection.hidden
document.getElementById('info-show').onclick = () => infoSection.hidden = !infoSection.hidden

let pauseActive = false;
function changePause(event) {pauseActive = !pauseActive; pauseBtn.firstElementChild.src = pauseActive ? 'images/play-solid.svg' : 'images/pause-solid.svg'};

let pauseBtn = document.getElementById('pause');

let showSectors = document.getElementById('show-sectors');
let showViewRanges = document.getElementById('show-view-ranges');

let speedSelect = document.getElementById('speed');
let forestSelect = document.getElementById('forest');

let timeLabel = document.getElementById('timer');
let totalTimeLabel = document.getElementById('total-time');

let treePopulationLimit = document.getElementById('trees-limit')
let animalPopulationLimit = document.getElementById('animals-limit')

let app = new Application({
	canvas, 
	sectors: {x:20, y: 20}, 
	showSectors: showSectors.checked, 
	reproductionMode: true, 
	showViewRanges: showViewRanges.checked,
	treePopulationLimit: parseInt(treePopulationLimit.value),
	animalPopulationLimit: parseInt(animalPopulationLimit.value)

});
globalThis.app = app;

app.addElems('tree', 100);
app.addElems('gatherer',5, null, 'male');
app.addElems('gatherer',5, null, 'female');
// app.addElems('hunter',2, null, 'male');
// app.addElems('hunter',2, null, 'female');
// app.addElems('hunter',1);

let mspf = Math.floor(1000/parseInt(speedSelect.value));
let timeForAddTrees = Math.floor(200*mspf/1000);
let i = timeForAddTrees;
let newTreeCount = parseInt(forestSelect.value);

let renderId = setInterval(() => {if (!pauseActive) app.update()}, mspf)
let addTreesId = setInterval(() => {if (!pauseActive) app.addElems('tree', newTreeCount)}, mspf*200)
let timerId = setInterval(() => timeLabel.change(), 1000);

pauseBtn.onclick = changePause;
// canvas.onclick = changePause;

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

treePopulationLimit.onchange = (event) => {
	app.treePopulationLimit = parseInt(event.target.value);
	document.getElementById('trees-limit-value').innerText = event.target.value;
}
animalPopulationLimit.onchange = (event) => {
	app.animalPopulationLimit = parseInt(event.target.value);
	document.getElementById('animals-limit-value').innerText = event.target.value;
}

timeLabel.change();
totalTimeLabel.change();

let score = document.getElementById('score');
let maxScore = document.getElementById('max-score');

let maxScoreValue = document.cookie;

if (maxScoreValue) maxScore.innerText = maxScoreValue;

function createClicker(pos)
{
	let clicker = document.createElement('div');
	clicker.classList.add('dna');
	clicker.style.left = canvas.offsetLeft + pos.x + 'px';
	clicker.style.top = canvas.offsetTop + pos.y + 'px';
	clicker.onclick = (event) =>
	{
		score.innerText = app.addScore();
		if (app.score > maxScoreValue)
		{
			document.cookie = app.score;
			maxScore.innerText = app.score;
		}
		clicker.remove();
	};
	setTimeout(() => {if (clicker) clicker.remove()}, 75*mspf);
	document.body.append(clicker);
}

app.addClicker = createClicker;