import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ICoordinate, ISubscribableTreeLocation,} from '../interfaces';
import {TYPES} from '../types';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {SubscribableTreeLocationArgs} from './SubscribableTreeLocation';
import {
    getASampleTreeLocation1,
    sampleTreeLocation1Level,
    sampleTreeLocation1MapId,
    sampleTreeLocation1Point,
    sampleTreeLocationData1,
    sampleTreeLocationData1Level,
    sampleTreeLocationData1MapId,
    sampleTreeLocationData1Point
} from './treeLocationTestHelpers';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableTreeLocation:::DI constructor works', (t) => {
    const injects = injectionWorks<SubscribableTreeLocationArgs, ISubscribableTreeLocation>({
        container: myContainer,
        argsType: TYPES.SubscribableTreeLocationArgs,
        interfaceType: TYPES.ISubscribableTreeLocation,
    });
    expect(injects).to.equal(true);
    t.pass();
});
test('SubscribableTreeLocation:::.val() should display the value of the branchesMap', (t) => {
    expect(getASampleTreeLocation1().val()).to.deep.equal(sampleTreeLocationData1);
    t.pass();
});
test('SubscribableTreeLocation:::startPublishing() should call the' +
    ' onUpdate methods of all member Subscribable properties', (t) => {
    const FIRST_POINT_VALUE: ICoordinate = {x: 5, y: 7};
    const treeLocation = new MutableSubscribableTreeLocation(
        {updatesCallbacks: [],
            point: sampleTreeLocation1Point,
            level: sampleTreeLocation1Level,
            mapId: sampleTreeLocation1MapId});

    const pointOnUpdateSpy = sinon.spy(sampleTreeLocationData1Point, 'onUpdate');
    const levelOnUpdateSpy = sinon.spy(sampleTreeLocationData1Level, 'onUpdate');
    const mapIdOnUpdateSpy = sinon.spy(sampleTreeLocationData1MapId, 'onUpdate');

    treeLocation.startPublishing();
    expect(pointOnUpdateSpy.callCount).to.deep.equal(1);
    expect(levelOnUpdateSpy.callCount).to.deep.equal(1);
    expect(mapIdOnUpdateSpy.callCount).to.deep.equal(1);
    t.pass();
});
