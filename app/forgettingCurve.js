const e = 2.7182828
//memory strength in decibels - https://docs.google.com/spreadsheets/d/15O87qEZU_t69GrePtRHLTKnmqPUeYeDq0zzGIgRljJs/edit#gid=106595709
export function calculateStrength(R,t){
    console.log('calculateStrength R and t are', R, t)
    const proficiencyAsDecimal = R /100
    console.log('calculateStrength proficiecnyAsDecimal', proficiencyAsDecimal)
    console.log('')
    const logProficiency = Math.log(proficiencyAsDecimal)
    console.log('calculateStrength logProfiency', logProficiency)
    const ebbinghaus = -1 * t / logProficiency
    console.log('calculateStrength ebbinghaus ', ebbinghaus)
    const dbE = 10 * Math.log10(ebbinghaus)
    console.log('calculateStrength dbE ', dbE)
    return dbE > 0 ? dbE: 0
}

//calculate percent change of recall (e.g. proficiency)
//returns as a num in range [0,100]
export function calculateRecall(S, t){
    return Math.pow(e, -1 * t / Math.pow(10, S / 10))
}

//R input is in [0,1]
export function calculateTime(S, R){
    return -1 * Math.pow(10, S /10 ) * Math.log(R)
}

export function calculateCurrentStrength(currentProficiency, millisecondsSinceLastInteraction, previousInteractionStrength){

}
