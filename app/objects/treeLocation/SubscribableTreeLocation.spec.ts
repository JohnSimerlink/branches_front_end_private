import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {
    ICoordinate, IMutableSubscribableField,
    IMutableSubscribablePoint, ISubscribableTreeLocation,
} from '../interfaces';
import {MutableSubscribablePoint} from '../point/MutableSubscribablePoint';
import {TYPES} from '../types';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {SubscribableTreeLocationArgs} from './SubscribableTreeLocation';
import {MutableSubscribableField} from "../field/MutableSubscribableField";

myContainerLoadAllModules()
test('SubscribableTreeLocation:::DI constructor works', (t) => {
    
    const injects = injectionWorks<SubscribableTreeLocationArgs, ISubscribableTreeLocation>({
        container: myContainer,
        argsType: TYPES.SubscribableTreeLocationArgs,
        interfaceType: TYPES.ISubscribableTreeLocation,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('SubscribableTreeLocation:::constructor should set all the subscribable properties', (t) => {
    
    const FIRST_POINT_VALUE: ICoordinate = {x: 5, y: 7}
    const levelVal = 2
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level})
    expect(treeLocation.point).to.deep.equal(point)
    t.pass()
})
test('SubscribableTreeLocation:::.val() should display the value of the branchesMap', (t) => {
    
    const FIRST_POINT_VALUE: ICoordinate = {x: 5, y: 7}
    const levelVal = 2
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level})

    const expectedVal = {
        point: point.val(),
    }

    expect(treeLocation.val()).to.deep.equal(expectedVal)
    t.pass()
})
test('SubscribableTreeLocation:::startPublishing() should call the' +
    ' onUpdate methods of all member Subscribable properties', (t) => {
    
    const FIRST_POINT_VALUE: ICoordinate = {x: 5, y: 7}
    const levelVal = 2
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})
    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level})

    const pointOnUpdateSpy = sinon.spy(point, 'onUpdate')

    treeLocation.startPublishing()
    expect(pointOnUpdateSpy.callCount).to.deep.equal(1)
    t.pass()
})
