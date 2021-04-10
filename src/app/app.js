import {UnitFactory} from "../factories";


export class App {
    constructor (context) {
        this._unitFactory = new UnitFactory();

        this._ctx = context;
        this._storage = new Set();
    }

    addItem (newItem) {
        this._storage.add(newItem);
    }

    render () {
        for (let item of this._storage) {

        }
    }


    run () {

    }
}