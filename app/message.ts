import Snack
	from '../other_imports/snack/snack.js';
import {GLOBAL_BACKGROUND_COLOR} from './core/globals';
import {ProficiencyUtils} from './objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from './objects/proficiency/proficiencyEnum';

// if (typeof window !== 'undefined') {
// 	window.Snack = Snack;
// }
const DEFAULT_MESSAGE_DURATION = 8000
export function messageReviewNotification(
	{
		text,
		color = 'white',
		duration = DEFAULT_MESSAGE_DURATION,
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

export function messageNotification(
	{
		text,
		backgroundColor = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN),
		color = 'white',
		duration = 60000,
		onclick = defaultOnClick
	}) {

	const style = `
        color: ${color};
        background-color: ${backgroundColor};
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    `;
	const actionButtonStyle = `
        color: ${color}
    `;
	const html = `
        <div
         style="${style}"
         >
            <span>${text}</span>
            <span style="${actionButtonStyle}">DISMISS</span>
		</div>
    `;
	var snack = new Snack({
		domParent: document.querySelector('body'),
		onclick
	});

	// show a snack for 4s
	snack.show(html, duration);
}

export function messageError(
	{
		text,
		color = 'red',
		duration = DEFAULT_MESSAGE_DURATION,
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
