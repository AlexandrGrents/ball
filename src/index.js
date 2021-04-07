import {App} from "./app";
import {UI} from "./ui";

const ui = new UI();
const app = new App(ui.getCanvasContext());


window.ui = ui;
window.app = app;

ui.init();
app.run()