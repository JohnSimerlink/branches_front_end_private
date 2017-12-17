import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {
     IMutableSubscribablePoint,
} from '../interfaces';
import {MutableSubscribablePoint} from '../point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';

test('SubscribableTreeLocation:::constructor should set all the subscribable properties', (t) => {
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
    expect(treeLocation.point).to.deep.equal(point)
    t.pass()
})
test('SubscribableTreeLocation:::.val() should display the value of the object', (t) => {
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

    const expectedVal = {
        point: point.val(),
    }

    expect(treeLocation.val()).to.deep.equal(expectedVal)
    t.pass()
})
test('SubscribableTreeLocation:::startPublishing() should call the' +
    ' onUpdate methods of all member Subscribable properties', (t) => {
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

    const pointOnUpdateSpy = sinon.spy(point, 'onUpdate')

    treeLocation.startPublishing()
    expect(pointOnUpdateSpy.callCount).to.deep.equal(1)
    t.pass()
})
