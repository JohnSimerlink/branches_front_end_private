let moment = require("moment").default;
if (!moment) {
    moment = require("moment");
}
let num = 0;
export function log() {
    /*log.on && */ console.log(num++, moment(Date.now()).format("MM/DD/YY, h:mm:ss a"), ...arguments);
}

export function error() {
    console.error(...arguments);
}
