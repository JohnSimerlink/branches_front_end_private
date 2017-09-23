import Snack from 'snack.js'
if (typeof window !== 'undefined'){
    window.Snack = Snack
}
export default function message(msg, color = 'black') {
    //
    // var snack = Snack.make("<your_message>", { /*<your_options>*/ });
    // snack.show();

//     console.log('Snack constructor is', Snack)
//     var snack = new Snack();
// snack.message ("Luke, I'm your father." + msg)
//      .settings({ duration: Snack.LONG, hideOnClick: true })
//      .show();


    var html =  "<div style='color: " + color + "'>" + msg + "</div>"
    var snack = new Snack({
        domParent: document.querySelector('body')
    });
    // show a snack for 4s
    snack.show(html, 2000);
}