import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IMutableSubscribableTree, ISubscribableStoreSource, ITypeAndIdAndValUpdate,
    CustomStoreDataTypes,
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableStoreSource, SubscribableStoreSourceArgs} from './SubscribableStoreSource';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('SubscribableStoreSource - IMutableSubscribableTree -' +
    ' Dependency injection should set all properties in constructor', (t) => {
    const injects: boolean = injectionWorks<SubscribableStoreSourceArgs,
        ISubscribableStoreSource<IMutableSubscribableTree>>({
        container: myContainer,
        argsType: TYPES.MutableSubscribableGlobalStoreArgs,
        interfaceType: TYPES.IMutableSubscribableGlobalStore
    });
    expect(injects).to.equal(true);
    t.pass();
});
test('SubscribableStoreSource - get should work', (t) => {
    const tree: IMutableSubscribableTree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree);
    const hashmap = {};
    const type = CustomStoreDataTypes.TREE_DATA;
    hashmap[TREE_ID] = tree;
    const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
        = new SubscribableStoreSource({hashmap, type, updatesCallbacks: []});
    const fetchedTree: IMutableSubscribableTree = subscribableStoreSource.get(TREE_ID);
    expect(tree).to.deep.equal(fetchedTree);
    t.pass();
});
test('SubscribableStoreSource - set should work', (t) => {
    const tree: IMutableSubscribableTree =
        myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree);
    const hashmap = {};
    const type = CustomStoreDataTypes.TREE_DATA;
    const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
        = new SubscribableStoreSource({hashmap, type, updatesCallbacks: []});
    subscribableStoreSource.set(TREE_ID, tree);
    const fetchedTree: IMutableSubscribableTree = subscribableStoreSource.get(TREE_ID);
    expect(tree).to.deep.equal(fetchedTree);
    t.pass();
});
test('SubscribableStoreSource - set should call callbacks', (t) => {
    const callback = sinon.spy();
    const tree: IMutableSubscribableTree =
        myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree);
    const type = CustomStoreDataTypes.TREE_DATA;
    const hashmap = {};
    const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
        = new SubscribableStoreSource({hashmap, type, updatesCallbacks: [callback]});
    subscribableStoreSource.set(TREE_ID, tree);
    expect(callback.callCount).to.equal(1);
    const calledWith: ITypeAndIdAndValUpdate = callback.getCall(0).args[0];
    expect(calledWith).to.deep.equal({id: TREE_ID, val: tree.val(), obj: tree, type});
    t.pass();
});
