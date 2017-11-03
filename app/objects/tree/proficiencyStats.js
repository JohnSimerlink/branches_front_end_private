"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable object-literal-sort-keys */
// import {PROFICIENCIES} from '../../components/proficiencyEnum';
/* TODO: for some reason ^^ importing the above causes my unit tests to not work,
 so I have manually copied and pasted the PROFICIENCIES var here
  */
var PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 12.5,
    TWO: 37.5,
    THREE: 62.5,
    FOUR: 87.5,
};
function addObjToProficiencyStats(proficiencyStats, deltaObj) {
    var newStats = __assign({}, proficiencyStats);
    Object.keys(deltaObj).forEach(function (key) {
        newStats[key] = (newStats[key] || 0) + (deltaObj[key] || 0);
    });
    return newStats;
}
exports.addObjToProficiencyStats = addObjToProficiencyStats;
function incrementProficiencyStatsCategory(proficiencyStats, proficiency) {
    if (proficiency <= PROFICIENCIES.UNKNOWN) {
        proficiencyStats.UNKNOWN++;
    }
    else if (proficiency <= PROFICIENCIES.ONE) {
        proficiencyStats.ONE++;
    }
    else if (proficiency <= PROFICIENCIES.TWO) {
        proficiencyStats.TWO++;
    }
    else if (proficiency <= PROFICIENCIES.THREE) {
        proficiencyStats.THREE++;
    }
    else if (proficiency <= PROFICIENCIES.FOUR) {
        proficiencyStats.FOUR++;
    }
    return proficiencyStats;
}
exports.incrementProficiencyStatsCategory = incrementProficiencyStatsCategory;
