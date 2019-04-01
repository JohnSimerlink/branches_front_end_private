import test
	from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon
	from 'sinon';
import {
	sampleBranchesMap1,
	sampleBranchesMap1RootTreeId,
	sampleBranchesMapData1
} from './branchesMapTestHelpers';

test('SubscribableBranchesMap:::.val() should display the value of the branchesMap', (t) => {
	expect(sampleBranchesMap1.val()).to.deep.equal(sampleBranchesMapData1);
	t.pass();
});
test('SubscribableBranchesMap:::startPublishing() should call the onUpdate methods of' +
	' all member Subscribable properties', (t) => {

	const rootTreeIdOnUpdateSpy = sinon.spy(sampleBranchesMap1RootTreeId, 'onUpdate');
	sampleBranchesMap1.startPublishing();
	expect(rootTreeIdOnUpdateSpy.callCount).to.deep.equal(1);
	t.pass();
});
