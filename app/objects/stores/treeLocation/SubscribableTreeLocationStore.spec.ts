import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {
    FieldMutationTypes, IMutableSubscribablePoint, IProficiencyStats, IProppedDatedMutation,
    ISubscribableTreeLocationCore, ISubscribableTreeLocationStore, PointMutationTypes,
    TreeLocationPropertyNames
} from '../../interfaces';
import {MutableSubscribablePoint} from '../../point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../treeLocation/MutableSubscribableTreeLocation';
import {TYPES} from '../../types';

test('SubscribableTreeLocationStore > addAndSubscribeToItem:::' +
    'An update in a member treeLocation should be published to a subscriber of the treeLocation data stores', (t) => {
    const treeId = TREE_ID
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {delta: {x: 3, y: 4}}
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
    // const treeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore)
    const callback1 = sinon.spy()
    const callback2 = sinon.spy()

    treeLocationStore.onUpdate(callback2)
    treeLocationStore.onUpdate(callback1)
    treeLocationStore.startPublishing()
    treeLocationStore.addAndSubscribeToItem(treeId, treeLocation)

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
    t.pass()
})
