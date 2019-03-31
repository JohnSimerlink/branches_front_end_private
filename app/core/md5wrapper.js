const md5c = require("crypto-js/md5"); // md5
export default function (message) {
    return md5c(message).toString();
}
/* This file is needed for typescript and mocha together.
 Why regular import md5 from 'md5' wont work for typescript files being processed through mocha or javascript files being
 imported from typescript files being processed by mocha won't work is beyond me.
 */
