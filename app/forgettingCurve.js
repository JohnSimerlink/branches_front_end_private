import {PROFICIENCIES} from "./components/proficiencyEnum";

const e = 2.7182828
//memory strength in decibels - https://docs.google.com/spreadsheets/d/15O87qEZU_t69GrePtRHLTKnmqPUeYeDq0zzGIgRljJs/edit#gid=106595709
export function calculateStrength(R,t){
    const proficiencyAsDecimal = R /100
    const logProficiency = Math.log(proficiencyAsDecimal)
    const ebbinghaus = -1 * t / logProficiency
    const dbE = 10 * Math.log10(ebbinghaus)
    console.log(R, t, " -> ", dbE," dbE")
    return dbE > 0 ? dbE: 0
}
//Se = previous estimated strength
//R = proficiency from 0 to 100
//t equals time since previous interaction
export function measurePreviousStrength(Se, R,t){

    //if proficiency is greater than/equal to 99 or less than/equal to 1, we have a wide range of possibilities for measured strength values - see this google sheet - https://docs.google.com/spreadsheets/d/15O87qEZU_t69GrePtRHLTKnmqPUeYeDq0zzGIgRljJs/edit#gid=2051263794
    //therefore just use the previous estimated value, because we can't really measure the actual value
    if (R>= 99 || R <=1){
        return Se
    }
    const proficiencyAsDecimal = R /100
    const logProficiency = Math.log(proficiencyAsDecimal)
    const ebbinghaus = -1 * t / logProficiency
    let previousStrength = 10 * Math.log10(ebbinghaus)
    console.log(R +"," + t + " -> "  + previousStrength + " dbE")
    previousStrength = previousStrength > 0 ? previousStrength: 0
    return previousStrength
}

//calculate percent change of recall (e.g. proficiency)
//returns as a num in range [0,1]
export function calculateRecall(S, t){
    return Math.pow(e, -1 * t / decibelsToEbbinghaus(S))
}

function decibelsToEbbinghaus(dbE){
    return Math.pow(10, dbE / 10)
}
//R input is in [0,1]
export function calculateTime(S, R){
    return -1 * decibelsToEbbinghaus(S) * Math.log(R)
}

export function estimateCurrentStrength(previousInteractionStrengthDecibels, currentProficiency, secondsSinceLastInteraction){
    const t = secondsSinceLastInteraction
    const Bt = 1 - calculateRecall(previousInteractionStrengthDecibels,t)
    const Bp = (e * currentProficiency - 1) / (e - 1)
    const Bc = 10 * (e - 1)
    const deltaStrength = previousInteractionStrengthDecibels + Bt * Bp * Bc
    const newInteractionStrengthDecibels = previousInteractionStrengthDecibels + deltaStrength
    console.log(previousInteractionStrengthDecibels + "dBE", currentProficiency, secondsSinceLastInteraction + "s", "->", newInteractionStrengthDecibels + "dbE")
    return newInteractionStrengthDecibels
}
