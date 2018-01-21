import moment from 'moment'
let num = 0
export function log(){
    console.log(num++, moment(Date.now()).format('MM/DD/YY, h:mm:ss a'), ...arguments)
}
export function error(){
    console.error(...arguments)
}