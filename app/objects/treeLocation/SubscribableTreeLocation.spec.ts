import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon from 'sinon';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {
	getASampleTreeLocation1,
	sampleTreeLocation1Level,
	sampleTreeLocation1MapId,
	sampleTreeLocation1Point,
	sampleTreeLocationData1,
} from './treeLocationTestHelpers';

test('SubscribableTreeLocation:::.val() should display the value of the branchesMap', (t) => {
	expect(getASampleTreeLocation1().val()).to.deep.equal(sampleTreeLocationData1);
	t.pass();
});
test('SubscribableTreeLocation:::startPublishing() should call the' +
	' onUpdate methods of all member Subscribable properties', (t) => {
	const treeLocation = new MutableSubscribableTreeLocation(
		{
			updatesCallbacks: [],
			point: sampleTreeLocation1Point,
			level: sampleTreeLocation1Level,
			mapId: sampleTreeLocation1MapId
		});

	const pointOnUpdateSpy = sinon.spy(sampleTreeLocation1Point, 'onUpdate');
	const levelOnUpdateSpy = sinon.spy(sampleTreeLocation1Level, 'onUpdate');
	const mapIdOnUpdateSpy = sinon.spy(sampleTreeLocation1MapId, 'onUpdate');

	treeLocation.startPublishing();
	expect(pointOnUpdateSpy.callCount).to.deep.equal(1);
	expect(levelOnUpdateSpy.callCount).to.deep.equal(1);
	expect(mapIdOnUpdateSpy.callCount).to.deep.equal(1);
	t.pass();
});
