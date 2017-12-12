import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    FieldMutationTypes, IProficiencyStats, IProppedDatedMutation, ISubscribableTreeLocationCore,
    ISubscribableTreeLocationStore, ISubscribableUndoableMutablePoint, PointMutationTypes,
    TreeLocationPropertyNames
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../../set/SubscribableMutableStringSet';
import {MutableSubscribableTreeLocation} from '../../treeLocation/MutableSubscribableTreeLocation';
import {TYPES} from '../../types';
import {SubscribableTreeLocationStore} from './SubscribableTreeLocationStore';
import {MutableSubscribablePoint} from '../../point/MutableSubscribablePoint';
import {TREE_ID} from '../../../testHelpers/testHelpers';

describe('SubscribableTreeLocationStore > addAndSubscribeToItem', () => {
    it('An update in a member treeLocation should be published to a subscriber of the treeLocation data stores', () => {
        const treeId = TREE_ID
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {delta: {x: 3, y: 4}}
        const point: ISubscribableUndoableMutablePoint
            = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        // const treeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
        // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
        const treeLocationStore: ISubscribableTreeLocationStore = new SubscribableTreeLocationStore({
            store: {},
            updatesCallbacks: []
        })
        const callback1 = sinon.spy()
        const callback2 = sinon.spy()

        treeLocationStore.onUpdate(callback2)
        treeLocationStore.onUpdate(callback1)
        treeLocationStore.startPublishing()
        treeLocationStore.addAndSubscribeToItem( treeId, treeLocation)

        const sampleMutation: IProppedDatedMutation<PointMutationTypes, TreeLocationPropertyNames> = {
            data: MUTATION_VALUE,
            propertyName: TreeLocationPropertyNames.POINT,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }

        treeLocation.addMutation(sampleMutation)

        const treeLocationNewVal = treeLocation.val()
        expect(callback1.callCount).to.equal(1)
        expect(callback1.getCall(0).args[0].id).to.equal(treeId)
        expect(callback1.getCall(0).args[0].val).to.deep.equal(treeLocationNewVal)
        expect(callback2.callCount).to.equal(1)
        expect(callback2.getCall(0).args[0].id).to.equal(treeId)
        expect(callback2.getCall(0).args[0].val).to.deep.equal(treeLocationNewVal)

    })
})
