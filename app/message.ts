import Snack from '../other_imports/snack/snack.js';
import {log} from './core/log';

// if (typeof window !== 'undefined') {
// 	window.Snack = Snack;
// }
export default function message(
    {
        text, color = 'white',
        duration = 4000,
        onclick = defaultOnClick
    }) {
    var html = "<div style='color: " + color + ";'>" + text + "</div>";
    var snack = new Snack({
        domParent: document.querySelector('body'),
        onclick
    });
    // show a snack for 4s
    snack.show(html, duration);
}

function defaultOnClick(snack) {
    snack.hide()
}
