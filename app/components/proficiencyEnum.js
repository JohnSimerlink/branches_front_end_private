import {Globals} from '../core/globals.js'
export const PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 1,
    TWO: 33,
    THREE: 67,
    FOUR: 99,// DON"T make this 100. bc 100/100 is 1. and log of 1 is 0. and n/0 is undefined, which is what was happening in our math.
}

export function proficiencyToColor(proficiency){
    if (proficiency > PROFICIENCIES.THREE) return Globals.colors.proficiency_4;
    if (proficiency > PROFICIENCIES.TWO) return Globals.colors.proficiency_3;
    if (proficiency > PROFICIENCIES.ONE) return Globals.colors.proficiency_2;
    if (proficiency > PROFICIENCIES.UNKNOWN) return Globals.colors.proficiency_1;
    return Globals.colors.proficiency_unknown;
}
