"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var curve = require("../app/forgettingCurve");
describe('measuringPreviousStrength', function () {
    it("should return estimated previous strength if proficiency >= PROFICIENCIES.FOUR\n    and time since last review was really short", function () {
        chai_1.expect(curve.measurePreviousStrength(40, 99, 2)).to.equal(40);
        chai_1.expect(curve.measurePreviousStrength(40, 99.9, 2)).to.equal(40);
    });
    it("should return estimated previous strength if proficiency <= 1'\n        ' and time since last review was really long", function () {
        chai_1.expect(curve.measurePreviousStrength(40, 1, 9999999)).to.equal(40);
        chai_1.expect(curve.measurePreviousStrength(40, .1, 9999999)).to.equal(40);
        /* if you were to plug in 1% in our formula for 9999999 seconds
         you would normally get 63 dB,
          which doesn't make sense given the previous estimated decibel strength of 40 */
    });
    it('should return 10 dbE for 1/e proficiency and 10 seconds', function () {
        chai_1.expect(curve.measurePreviousStrength(39, 100 * 1 / curve.e, 10)).to.closeTo(10, .1);
    });
    it('should return 50 dbE for 75% proficiency and 8 hours', function () {
        chai_1.expect(curve.measurePreviousStrength(39, 100 * .75, 8 * 60 * 60)).to.closeTo(50, .1);
    });
});
describe('estimateCurrentStrength', function () {
    it('should return previous strength for 1/e proficiency', function () {
        chai_1.expect(curve.estimateCurrentStrength(39, 100 * 1 / curve.e, 8 * 60 * 60)).to.closeTo(39, .1);
    });
    it('should return previous strength for 0 seconds since last review', function () {
        chai_1.expect(curve.estimateCurrentStrength(39, 100 * 1 / curve.e, 0)).to.closeTo(39, .1);
    });
    it('should return + 10(e-1) dB for 100% proficiency and longgg time since last review', function () {
        var originalStrength = 39;
        var newExpectedStrength = originalStrength + 10 * (curve.e - 1);
        chai_1.expect(curve.estimateCurrentStrength(39, 99.99999, 9999999999)).to.closeTo(newExpectedStrength, .1);
    });
    it('should return + 10(1 - 1/e) dB for 100% proficiency at Tc', function () {
        var originalStrength = 39;
        var newExpectedStrength = originalStrength + 10 * (1 - 1 / curve.e);
        var Tc = curve.calculateTime(originalStrength, curve.criticalRecall);
        chai_1.expect(curve.estimateCurrentStrength(39, 99.99999, Tc)).to.closeTo(newExpectedStrength, .1);
    });
    it('should return + 4.4dB for 99% proficiency at 40 minutes past a 39 strength memory ', function () {
        var originalStrength = 39;
        var proficiency = 99;
        var timeSincePreviousInteraction = 40 * 60;
        var newStrength = originalStrength + 4.4;
        var estimatedCurrentStrength = curve.estimateCurrentStrength(originalStrength, proficiency, timeSincePreviousInteraction);
        chai_1.expect(estimatedCurrentStrength).to.closeTo(newStrength, .1);
    });
});
