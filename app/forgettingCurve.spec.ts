import {expect} from 'chai';
import * as curve
	from '../app/forgettingCurve';
import test
	from 'ava';

test(`should return estimated previous strength if proficiency >= PROFICIENCIES.FOUR
and time since last review was really short`, (t) => {
	expect(curve.measurePreviousStrength({
		estimatedPreviousStrength: 40,
		R: 99,
		t: 2
	})).to.equal(40);
	expect(curve.measurePreviousStrength({
		estimatedPreviousStrength: 40,
		R: 99.9,
		t: 2
	})).to.equal(40);
	t.pass();
});
test(`should return estimated previous strength if proficiency <= 1'
    ' and time since last review was really long`, (t) => {
	expect(curve.measurePreviousStrength({
		estimatedPreviousStrength: 40,
		R: 1,
		t: 9999999
	})).to.equal(40);
	expect(curve.measurePreviousStrength({
		estimatedPreviousStrength: 40,
		R: .1,
		t: 9999999
	})).to.equal(40);
	/* if you were to plug in 1% in our formula for 9999999 seconds
	 you would normally get 63 dB,
		which doesn't make sense given the previous estimated decibel strength of 40 */
	t.pass();
});
test('should return 10 dbE for 1/e sampleContentUser1Proficiency and 10 seconds', (t) => {
	expect(curve.measurePreviousStrength(
		{
			estimatedPreviousStrength: 39,
			R: 100 * 1 / curve.e,
			t: 10
		})).to.closeTo(10, .1);
	t.pass();
});
test('should return 50 dbE for 75% sampleContentUser1Proficiency and 8 hours', (t) => {
	expect(curve.measurePreviousStrength(
		{
			estimatedPreviousStrength: 39,
			R: 100 * .75,
			t: 8 * 60 * 60
		})).to.closeTo(50, .1);
	t.pass();
});
test('should return previous strength for 1/e sampleContentUser1Proficiency', (t) => {
	expect(curve.estimateCurrentStrength(
		{
			previousInteractionStrengthDecibels: 39,
			currentProficiency: 100 * 1 / curve.e,
			secondsSinceLastInteraction: 8 * 60 * 60
		})).to.closeTo(39, .1);
	t.pass();
});
test('should return previous strength for 0 seconds since last review', (t) => {
	expect(curve.estimateCurrentStrength(
		{
			previousInteractionStrengthDecibels: 39,
			currentProficiency: 100 * 1 / curve.e,
			secondsSinceLastInteraction: 0
		})).to.closeTo(39, .1);
	t.pass();
});
test('should return + 10(e-1) dB for 100% sampleContentUser1Proficiency and longgg time since last review', (t) => {
	const originalStrength = 39;
	const newExpectedStrength = originalStrength + 10 * (curve.e - 1);
	expect(curve.estimateCurrentStrength(
		{
			previousInteractionStrengthDecibels: 39,
			currentProficiency: 99.99999,
			secondsSinceLastInteraction: 9999999999
		})).to.closeTo(newExpectedStrength, .1);
	t.pass();
});
test('should return + 10(1 - 1/e) dB for 100% sampleContentUser1Proficiency at Tc', (t) => {
	const originalStrength = 39;
	const newExpectedStrength = originalStrength + 10 * (1 - 1 / curve.e);
	const Tc = curve.calculateTime({
		S: originalStrength,
		R: curve.criticalRecall
	});

	expect(curve.estimateCurrentStrength(
		{
			previousInteractionStrengthDecibels: 39,
			currentProficiency: 99.99999,
			secondsSinceLastInteraction: Tc
		})).to.closeTo(newExpectedStrength, .1);
	t.pass();
});
test('should return + 4.4dB for 99% sampleContentUser1Proficiency at 40 minutes past a 39 strength memory ', (t) => {
	const originalStrength = 39;
	const proficiency = 99;
	const timeSincePreviousInteraction = 40 * 60;

	const newStrength = originalStrength + 4.4;
	const estimatedCurrentStrength = curve.estimateCurrentStrength({
		previousInteractionStrengthDecibels: originalStrength,
		currentProficiency: proficiency,
		secondsSinceLastInteraction: timeSincePreviousInteraction
	});
	expect(estimatedCurrentStrength).to.closeTo(newStrength, .1);
	t.pass();
});
