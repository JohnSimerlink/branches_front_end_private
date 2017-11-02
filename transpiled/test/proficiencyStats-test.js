"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var proficiencyStats_1 = require("../app/objects/tree/proficiencyStats");
describe('addObjToProficiencyStats', function () {
    it('should add a standalone ONE object to the current object', function () {
        var proficiencyStats = {
            UNKNOWN: 5,
            ONE: 4,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        };
        var ONE = { ONE: 1 };
        var answer = {
            UNKNOWN: 5,
            ONE: 5,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        };
        var attemptedAnswer = proficiencyStats_1.addObjToProficiencyStats(proficiencyStats, ONE);
        chai_1.expect(attemptedAnswer).to.deep.equal(answer);
    });
    it('should correctly add another object to the current object', function () {
        var proficiencyStats = {
            UNKNOWN: 5,
            ONE: 4,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        };
        var obj = {
            UNKNOWN: 3,
            ONE: 1,
            TWO: 4,
            THREE: 6,
            FOUR: 2,
        };
        var answer = {
            UNKNOWN: 8,
            ONE: 5,
            TWO: 5,
            THREE: 10,
            FOUR: 4,
        };
        chai_1.expect(proficiencyStats_1.addObjToProficiencyStats(proficiencyStats, obj)).to.deep.equal(answer);
    });
});

//# sourceMappingURL=proficiencyStats-test.js.map
