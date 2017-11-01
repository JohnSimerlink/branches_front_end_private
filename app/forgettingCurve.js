"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proficiencyEnum_1 = require("./components/proficiencyEnum");
exports.e = 2.7182828;
exports.criticalRecall = 1 - 1 / exports.e;
/* memory strength in decibels -
 https://docs.google.com/spreadsheets/d/15O87qEZU_t69GrePtRHLTKnmqPUeYeDq0zzGIgRljJs/edit#gid=106595709
 */
function calculateStrength(R, t) {
    var proficiencyAsDecimal = R / 100;
    var logProficiency = Math.log(proficiencyAsDecimal);
    var ebbinghaus = -1 * t / logProficiency;
    var dbE = 10 * Math.log10(ebbinghaus);
    console.log(R, t, ' -> ', dbE, ' dbE');
    return dbE > 0 ? dbE : 0;
}
exports.calculateStrength = calculateStrength;
// Se = previous estimated strength
// R = proficiency from 0 to 100
// t equals time since previous interaction
function calculateSecondsTilCriticalReviewTime(strength) {
    return calculateTime(strength, exports.criticalRecall);
}
exports.calculateSecondsTilCriticalReviewTime = calculateSecondsTilCriticalReviewTime;
// function measureInitialPreviousInteractionStrength
function measurePreviousStrength(estimatedPreviousStrength, R, t) {
    var proficiencyAsDecimal = R / 100;
    var logProficiency = Math.log(proficiencyAsDecimal);
    var ebbinghaus = -1 * t / logProficiency;
    var measuredPreviousStrength = 10 * Math.log10(ebbinghaus);
    measuredPreviousStrength = measuredPreviousStrength > 0 ? measuredPreviousStrength : 0;
    /* if proficiency is greater than/equal to 99 or less than/equal to 1,
     we have a wide range of possibilities for measured strength values  */
    // therefore just use the previous estimated value, because we can't really measure the actual value
    /* if proficiency is less than 1, and its been a really long time
    since the user last saw the fact,
    our measure strength formula above can unintentionally think
     the user's strength value was much higher than it possible
      could have been,
      since we are only recording the value as 1% and not the
      actual .01% or whatever it actually is
     */
    if (doubleLessThanOrEqualTo(R, proficiencyEnum_1.PROFICIENCIES.ONE) && measuredPreviousStrength > estimatedPreviousStrength) {
        measuredPreviousStrength = estimatedPreviousStrength;
    }
    /* if proficiency is greater than 99,
    and its been a really short time since the user last saw the fact,
     our measure strength formula above can unintentionally think
      the user's strength value was much lower than it possible could have been,
      since we are only recording the value as 99% and not the actually 99.99% or whatever it actually is
      */
    if (doubleGreaterThanOrEqualTo(R, proficiencyEnum_1.PROFICIENCIES.FOUR) && measuredPreviousStrength < estimatedPreviousStrength) {
        measuredPreviousStrength = estimatedPreviousStrength;
    }
    return measuredPreviousStrength;
}
exports.measurePreviousStrength = measurePreviousStrength;
function doubleLessThanOrEqualTo(doubleOne, doubleTwo) {
    return doubleOne <= (doubleTwo + .01);
}
function doubleGreaterThanOrEqualTo(doubleOne, doubleTwo) {
    return doubleOne >= (doubleTwo - .01);
}
// calculate percent change of recall (e.g. proficiency)
// returns as a num in range [0,1]
function calculateRecall(S, t) {
    return Math.pow(exports.e, -1 * t / decibelsToEbbinghaus(S));
}
exports.calculateRecall = calculateRecall;
function decibelsToEbbinghaus(dbE) {
    return Math.pow(10, dbE / 10);
}
// R input is in [0,1]
function calculateTime(S, R) {
    return -1 * decibelsToEbbinghaus(S) * Math.log(R);
}
exports.calculateTime = calculateTime;
// current proficiency in [0, 100]
function estimateCurrentStrength(previousInteractionStrengthDecibels, currentProficiency, secondsSinceLastInteraction) {
    var newInteractionStrengthDecibels;
    var t = secondsSinceLastInteraction;
    if (currentProficiency <= proficiencyEnum_1.PROFICIENCIES.ONE) {
        var t1percent = calculateTime(previousInteractionStrengthDecibels, currentProficiency / 100);
        if (t >= t1percent) {
            newInteractionStrengthDecibels = previousInteractionStrengthDecibels * t1percent / t;
        }
        else {
            newInteractionStrengthDecibels = previousInteractionStrengthDecibels;
        }
    }
    else {
        currentProficiency = currentProficiency / 100;
        var Bt = 1 - calculateRecall(previousInteractionStrengthDecibels, t);
        var Bp = (exports.e * currentProficiency - 1) / (exports.e - 1);
        var Bc = 10 * (exports.e - 1);
        var deltaStrength = Bt * Bp * Bc;
        newInteractionStrengthDecibels = previousInteractionStrengthDecibels + deltaStrength;
    }
    newInteractionStrengthDecibels = newInteractionStrengthDecibels < 10 ? 10 : newInteractionStrengthDecibels;
    return newInteractionStrengthDecibels;
}
exports.estimateCurrentStrength = estimateCurrentStrength;
