/**
 * Отвечает за пользовательский интерфейс
 * class UI
 */
export class UI {

    constructor () {
        this._canvas = document.getElementById('app');
        this._correctCanvasSize();

        this._addButtons();
    }

    _addButtons () {
        this._buttons = {
            win: document.getElementById('win'),
        };
    }

    /**
     * Корректирует размеры канваса
     * @private
     */
    _correctCanvasSize () {
        const canvasWidth = +this._canvas.getAttribute('width');
        const canvasHeight = +this._canvas.getAttribute('height');

        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight

        const needCanvasVerticalResize =  clientWidth / clientHeight > canvasWidth / canvasHeight;

        const [canvasElementWidth, canvasElementHeight] = needCanvasVerticalResize
            ? [clientHeight * canvasWidth / canvasHeight, clientHeight]
            : [clientWidth, clientWidth * canvasHeight / canvasWidth];

        this._canvas.style.width = canvasElementWidth + 'px';
        this._canvas.style.height = canvasElementHeight + 'px';
    }

    _addEventListeners () {
        window.addEventListener('resize', this._correctCanvasSize.bind(this));
        this._buttons.win.onclick = () => {
            alert('Вы победили!');
        }
    }


    init () {
        this._addEventListeners();
    }

    getCanvasContext () {
        return this._canvas.getContext('2d');
    }
}