import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    IProficiencyStats,
    ISubscribableMutableField,
    ISubscribableMutableStringSet, ISubscribableUndoableMutablePoint,
} from '../interfaces';
import {SubscribableMutablePoint} from '../point/SubscribableMutablePoint';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {SubscribableTreeLocation} from './SubscribableTreeLocation';

describe('SubscribableTreeLocation', () => {
    it('constructor should set all the subscribable properties', () => {

        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        expect(treeLocation.point).to.deep.equal(point)
    })
    it('.val() should display the value of the object', () => {
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

        const expectedVal = {
            point: point.val(),
        }

        expect(treeLocation.val()).to.deep.equal(expectedVal)
    })
    it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

        const pointOnUpdateSpy = sinon.spy(point, 'onUpdate')

        treeLocation.startPublishing()
        expect(pointOnUpdateSpy.callCount).to.deep.equal(1)
    })
})
