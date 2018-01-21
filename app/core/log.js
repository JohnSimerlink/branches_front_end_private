let num = 0
export function log(){
    console.log(num++, Date.now(), ...arguments)
}
export function error(){
    console.error(...arguments)
}