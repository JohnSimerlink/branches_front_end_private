// tslint:disable no-var-requires
// tslint:disable branchesMap-literal-sort-keys
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import {expect} from 'chai'

import test from 'ava'
import {IProficiencyStats} from '../interfaces';
import {addObjToProficiencyStats} from './proficiencyStatsUtils';

injectFakeDom();

test('addObjToProficiencyStats::::should add a standalone ONE branchesMap to the current branchesMap', (t) => {
	const proficiencyStats: IProficiencyStats = {
		UNKNOWN: 5,
		ONE: 4,
		TWO: 1,
		THREE: 4,
		FOUR: 2,
	};
	const ONE = {ONE: 1};
	const answer: IProficiencyStats = {
		UNKNOWN: 5,
		ONE: 5,
		TWO: 1,
		THREE: 4,
		FOUR: 2,
	};
	const attemptedAnswer = addObjToProficiencyStats(proficiencyStats, ONE as IProficiencyStats);
	expect(attemptedAnswer).to.deep.equal(answer);
	t.pass();
});
test('addObjToProficiencyStats::::should correctly add another branchesMap to the current branchesMap 1', (t) => {
	const proficiencyStats: IProficiencyStats = {
		UNKNOWN: 5,
		ONE: 4,
		TWO: 1,
		THREE: 4,
		FOUR: 2,
	};
	const obj: IProficiencyStats = {
		UNKNOWN: 3,
		ONE: 1,
		TWO: 4,
		THREE: 6,
		FOUR: 2,
	};
	const answer: IProficiencyStats = {
		UNKNOWN: 8,
		ONE: 5,
		TWO: 5,
		THREE: 10,
		FOUR: 4,
	};
	expect(addObjToProficiencyStats(proficiencyStats, obj)).to.deep.equal(answer);
	t.pass();
});
test('addObjToProficiencyStats::::should correctly add another branchesMap to the current branchesMap 1', (t) => {
	const proficiencyStats: IProficiencyStats = {
		UNKNOWN: 0,
		ONE: 4,
		TWO: 1,
		THREE: 4,
		FOUR: 2,
	};
	const obj: IProficiencyStats = {
		UNKNOWN: 3,
		ONE: 1,
		TWO: 4,
		THREE: 6,
		FOUR: 0,
	};
	const answer: IProficiencyStats = {
		UNKNOWN: 3,
		ONE: 5,
		TWO: 5,
		THREE: 10,
		FOUR: 2,
	};
	expect(addObjToProficiencyStats(proficiencyStats, obj)).to.deep.equal(answer);
	t.pass();
});

// describe('incrementProficiencyStatsCategory', () => {
//     // test('')
// })
