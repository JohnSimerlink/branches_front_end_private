import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    FieldMutationTypes, IProppedDatedMutation, ISubscribableTreeCore, ISubscribableTreeStore,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableMutableStringSet} from '../../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../tree/MutableSubscribableTree';
import {TYPES} from '../../types';

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableTreeStore > addItem::::' +
    'An update in a member tree should be published to a subscriber of the tree data stores', (t) => {
    /* TODO: Note this is more of an integration test than a true unit test.
    It might be that some of these modules are designed poorly, being the reason
     why I couldn't find an easy way to do a pure unit test.
     e.g. rather than just triggering an update directly on tree, I had to do it indirectly by adding a mutation
     */
    const contentId = new MutableSubscribableField<string>();
    const parentId = new MutableSubscribableField<string>();
    const children = new SubscribableMutableStringSet();
    const TREE_ID = 'efa123';
    const tree = new MutableSubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children});
    // const tree = myContainer.get<ISubscribableTree>(TYPES.ISubscribableTree)
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore);
    // const treeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    treeStore.onUpdate(callback2);
    treeStore.onUpdate(callback1);
    treeStore.startPublishing();
    /* TODO: add test to put subscribeToAllItems() before the onUpdates to show it works irrespective of order
     */
    treeStore.addItem(TREE_ID, tree);

    const sampleMutation = myContainer.get<IProppedDatedMutation<FieldMutationTypes,
        TreePropertyNames>>(TYPES.IProppedDatedMutation);

    tree.addMutation(sampleMutation);

    const treeNewVal = tree.val();
    expect(callback1.callCount).to.equal(1);
    expect(callback1.getCall(0).args[0].id).to.equal(TREE_ID);
    expect(callback1.getCall(0).args[0].val).to.deep.equal(treeNewVal);
    expect(callback2.callCount).to.equal(1);
    expect(callback2.getCall(0).args[0].id).to.equal(TREE_ID);
    expect(callback2.getCall(0).args[0].val).to.deep.equal(treeNewVal);
    t.pass()
});
