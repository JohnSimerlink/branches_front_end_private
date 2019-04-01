import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test
	from 'ava'
import {expect} from 'chai'
import {radian} from '../interfaces';
import {MathUtils} from './MathUtils';

injectFakeDom();

test('MathUtils::::percentageToRadians should do 0 -> 0', (t) => {
	const percentage = 0;
	const expectedRadians: radian = 0;
	expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians);
	t.pass();
});
test('MathUtils::::percentageToRadians should do .50 -> pi', (t) => {
	const percentage = .50;
	const expectedRadians: radian = Math.PI;
	expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians);
	t.pass();
});
test('MathUtils::::percentageToRadians should do .25 -> pi/2', (t) => {
	const percentage = .25;
	const expectedRadians: radian = Math.PI / 2;
	expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians);
	t.pass();
});
test('MathUtils::::percentageToRadians should do 1.00 -> 2 * pi', (t) => {
	const percentage = 1.00;
	const expectedRadians: radian = 2 * Math.PI;
	expect(MathUtils.percentageToRadians(percentage)).to.equal(expectedRadians);
	t.pass();
});
