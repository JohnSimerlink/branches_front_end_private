export function pseudoRandomInt0To100() {
	return Math.floor(Math.random() * 100)
}

/*
    From https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
export function getSomewhatRandomId() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}
