"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable object-literal-sort-keys */
// import {Globals} from '../core/globals'
/* TODO: for some reason ^^ importing the above causes my unit tests to not work,
 so I have manually copied and pasted the Globals var here
  */
var Globals = {
    colors: {
        proficiency_1: 'red',
        proficiency_2: 'orange',
        proficiency_3: 'yellow',
        proficiency_4: 'lawngreen',
        proficiency_unknown: 'gray',
    },
    currentTreeSelected: null,
    overdueSize: 14,
    regularSize: 10,
};
exports.PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 12.5,
    TWO: 37.5,
    THREE: 62.5,
    FOUR: 87.5,
};
function proficiencyToColor(proficiency) {
    if (proficiency > exports.PROFICIENCIES.THREE) {
        return Globals.colors.proficiency_4;
    }
    if (proficiency > exports.PROFICIENCIES.TWO) {
        return Globals.colors.proficiency_3;
    }
    if (proficiency > exports.PROFICIENCIES.ONE) {
        return Globals.colors.proficiency_2;
    }
    if (proficiency > exports.PROFICIENCIES.UNKNOWN) {
        return Globals.colors.proficiency_1;
    }
    return Globals.colors.proficiency_unknown;
}
exports.proficiencyToColor = proficiencyToColor;
