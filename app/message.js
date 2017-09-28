import Snack from '../other_imports/snack/snack.js'
if (typeof window !== 'undefined'){
    window.Snack = Snack
}
export default function message({text, color = 'white', duration = 2000, onclick = (snack) => {snack.hide()}}) {
    //
    // var snack = Snack.make("<your_message>", { /*<your_options>*/ });
    // snack.show();

//     console.log('Snack constructor is', Snack)
//     var snack = new Snack();
// snack.message ("Luke, I'm your father." + msg)
//      .settings({ duration: Snack.LONG, hideOnClick: true })
//      .show();


    var html =  "<div style='color: " + color + "'>" + text + "</div>"
    var snack = new Snack({
        domParent: document.querySelector('body'),
        onclick
    });
    // show a snack for 4s
    snack.show(html, duration);
}