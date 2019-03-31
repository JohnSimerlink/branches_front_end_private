import Snack
	from '../other_imports/snack/snack.js';
import {GLOBAL_BACKGROUND_COLOR} from './core/globals';

// if (typeof window !== 'undefined') {
// 	window.Snack = Snack;
// }
export function message(
	{
		text,
		color = 'white',
		duration = 4000,
		onclick = defaultOnClick
	}) {

	const style = `
        color: ${color};
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    `;
	const actionButtonStyle = `
        color: ${GLOBAL_BACKGROUND_COLOR}
    `;
	const html = `
        <div
         style="${style}"
         >
            <span>${text}</span>
            <span style="${actionButtonStyle}">REVIEW</span>
		</div>
    `;
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

export function messageError(
	{
		text,
		color = 'red',
		duration = 4000,
		onclick = defaultOnClick
	}) {
	const style = `
        color: ${color};
    `;
	const actionButtonStyle = `
        color: ${GLOBAL_BACKGROUND_COLOR}
    `;
	const html = `
        <div
         style="${style}"
         >
            <span>${text}</span>
		</div>
    `;
	var snack = new Snack({
		domParent: document.querySelector('body'),
		onclick
	});
	// show a snack for 4s
	snack.show(html, duration);
}
