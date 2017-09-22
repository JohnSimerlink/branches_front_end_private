import Snack from 'snackjs'
export default function message(message) {
    var snack = new Snack({
        domParent: document.querySelector('body')
    });
    // show a snack for 4s
    snack.show(message, 2000);
}