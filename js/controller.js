class Controller
{
	contrcuctor(app, mspf)
	{
		this.app = app;
		this.mspf = mspf;
		this.pauseActive = false;
	}
	updateMSPF(event)
	{

	}
	addPower(event)
	{

	}
	changePause(event)
	{
		this.pauseActive = !this.pauseActive;
		event.target.innerText = this.pauseActive ? 'Подолжить' : 'Пауза';
	}
}

export default Controller