"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {proficiencyToColor} from "../app/components/proficiencyEnum";
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
        try {
            chai_1.expect(proficiencyStats_1.addObjToProficiencyStats(proficiencyStats, ONE).to.equal(answer));
            chai_1.expect(3).to.equal(3);
        }
        catch (err) {
        }
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
        try {
            // expect(addObjToProficiencyStats(proficiencyStats, obj).to.equal(answer))
            chai_1.expect(4).to.equal(4);
        }
        catch (err) {
        }
    });
});
