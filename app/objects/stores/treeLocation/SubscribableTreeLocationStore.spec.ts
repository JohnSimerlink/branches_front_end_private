import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {
    IProppedDatedMutation,
    ISubscribableTreeLocationStore,
    PointMutationTypes,
    TreeLocationPropertyNames
} from '../../interfaces';
import {TYPES} from '../../types';
import {getASampleTreeLocation1} from "../../treeLocation/treeLocationTestHelpers";

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableTreeLocationStore > addItem:::' +
    'An update in a member treeLocation should be published to a subscriber of the treeLocation data stores', (t) => {
    const treeId = TREE_ID;
    const MUTATION_VALUE = {delta: {x: 3, y: 4}};

    const treeLocation = getASampleTreeLocation1();
    // const treeLocation = getTree
    // const treeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore);
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    treeLocationStore.onUpdate(callback2);
    treeLocationStore.onUpdate(callback1);
    treeLocationStore.startPublishing();
    treeLocationStore.addItem(treeId, treeLocation);

    const sampleMutation: IProppedDatedMutation<PointMutationTypes, TreeLocationPropertyNames> = {
        data: MUTATION_VALUE,
        propertyName: TreeLocationPropertyNames.POINT,
        timestamp: Date.now(),
        type: PointMutationTypes.SHIFT,
    };

    treeLocation.addMutation(sampleMutation);

    const treeLocationNewVal = treeLocation.val();
    expect(callback1.callCount).to.equal(1);
    expect(callback1.getCall(0).args[0].id).to.equal(treeId);
    expect(callback1.getCall(0).args[0].val).to.deep.equal(treeLocationNewVal);
    expect(callback2.callCount).to.equal(1);
    expect(callback2.getCall(0).args[0].id).to.equal(treeId);
    expect(callback2.getCall(0).args[0].val).to.deep.equal(treeLocationNewVal);
    t.pass();
});
