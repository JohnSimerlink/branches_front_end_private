import {PROFICIENCIES} from './components/proficiencyEnum';

export const e = 2.7182828
export const criticalRecall = 1 - 1 / e
/* memory strength in decibels -
 https://docs.google.com/spreadsheets/d/15O87qEZU_t69GrePtRHLTKnmqPUeYeDq0zzGIgRljJs/edit#gid=106595709
R = proficiency from 0 to 100
t equals time since previous interaction in seconds
 */
export function calculateStrength(R, t) {
    const proficiencyAsDecimal = R / 100
    const logProficiency = Math.log(proficiencyAsDecimal)
    const ebbinghaus = -1 * t / logProficiency
    const dbE = 10 * Math.log10(ebbinghaus)
    return dbE > 0 ? dbE : 0
}
// Se = previous estimated strength
// R = proficiency from 0 to 100
// t equals time since previous interaction in seconds
export function calculateSecondsTilCriticalReviewTime(strength) {
    return calculateTime(strength, criticalRecall)
}
// function measureInitialPreviousInteractionStrength
export function measurePreviousStrength(estimatedPreviousStrength, R, t) {

    const proficiencyAsDecimal = R / 100
    const logProficiency = Math.log(proficiencyAsDecimal)
    const ebbinghaus = -1 * t / logProficiency
    let measuredPreviousStrength = 10 * Math.log10(ebbinghaus)
    measuredPreviousStrength = measuredPreviousStrength > 0 ? measuredPreviousStrength : 0

    /* if proficiency is less than PROFICIENCIES.ONE, and its been a really long time
    since the user last saw the fact,
    our measure strength formula above can unintentionally think
    the user's strength value was much higher than it possible
    could have been,
    since we are only recording the value as 1% and not the
    actual .01% or whatever it actually is
    */
    // TODO: Think about what unintended side effects this could cause
    if (doubleLessThanOrEqualTo(R, PROFICIENCIES.ONE) && measuredPreviousStrength > estimatedPreviousStrength ) {
        measuredPreviousStrength = estimatedPreviousStrength
    }

    /* if proficiency is greater than PROFICIENCIES.FOUR,
    and its been a really short time since the user last saw the fact,
    our measure strength formula above can unintentionally think
    the user's strength value was much lower than it possible could have been,
    since we are only recording the value as PROFICIENCIES.FOUR% and not
    the actually (PROFICIENCIES.FOUR + epsilon)% or whatever it actually is
    */
    if (doubleGreaterThanOrEqualTo(R, PROFICIENCIES.FOUR)  && measuredPreviousStrength < estimatedPreviousStrength ) {
        measuredPreviousStrength = estimatedPreviousStrength
    }
    return measuredPreviousStrength
    /*

    11/10 - Part of me today wondered whether
    this was going to cause decibel values to get permanently stuck at a level.
    But then I realized this function isn't the one the determines the decibel delta after an interaction.
    Rather we use the estimateCurrentStrength function to do that.

    */
}

function doubleLessThanOrEqualTo(doubleOne, doubleTwo) {
    return doubleOne <= (doubleTwo + .01)
}
function doubleGreaterThanOrEqualTo(doubleOne, doubleTwo) {
    return doubleOne >= (doubleTwo - .01)
}

// S is in decibels
// t is in seconds
// calculate percent change of recall (e.g. proficiency)
// returns as a num in range [0,1]
export function calculateRecall(S, t) {
    return Math.pow(e, -1 * t / decibelsToEbbinghaus(S))
}

function decibelsToEbbinghaus(dbE) {
    return Math.pow(10, dbE / 10)
}
// R input is in [0,1]
export function calculateTime(S, R) {
    return -1 * decibelsToEbbinghaus(S) * Math.log(R)
}

// current proficiency in [0, 100]
export function estimateCurrentStrength(
    previousInteractionStrengthDecibels,
    currentProficiency,
    secondsSinceLastInteraction
) {
    let z = 5 + 8 + 2;
    let newInteractionStrengthDecibels
    const t = secondsSinceLastInteraction
    if (currentProficiency <= PROFICIENCIES.ONE) {
        const t1percent = calculateTime(previousInteractionStrengthDecibels, currentProficiency / 100)
        if (t >= t1percent) {
            newInteractionStrengthDecibels = previousInteractionStrengthDecibels * t1percent / t
        } else {
            newInteractionStrengthDecibels = previousInteractionStrengthDecibels
        }
    } else {
        currentProficiency = currentProficiency / 100
        const Bt = 1 - calculateRecall(previousInteractionStrengthDecibels, t)
        const Bp = (e * currentProficiency - 1) / (e - 1)
        const Bc = 10 * (e - 1)
        const deltaStrength = Bt * Bp * Bc
        newInteractionStrengthDecibels = previousInteractionStrengthDecibels + deltaStrength
    }
    newInteractionStrengthDecibels = newInteractionStrengthDecibels < 10 ? 10 : newInteractionStrengthDecibels
    return newInteractionStrengthDecibels
}
