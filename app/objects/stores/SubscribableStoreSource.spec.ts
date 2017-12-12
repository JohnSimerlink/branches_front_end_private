import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {
    IMutableSubscribableTree, ISubscribableStoreSource, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableStoreSource, SubscribableStoreSourceArgs} from './SubscribableStoreSource';

describe('SubscribableStoreSource', () => {
    it(' - IMutableSubscribableTree - Dependency injection should set all properties in constructor', () => {
        const injects: boolean = injectionWorks<SubscribableStoreSourceArgs,
            ISubscribableStoreSource<IMutableSubscribableTree>>({
            container: myContainer,
            argsType: TYPES.MutableSubscribableGlobalStoreArgs,
            classType: TYPES.IMutableSubscribableGlobalStore
        })
        expect(injects).to.equal(true)
    })
    it('get should work', () => {
        const tree: IMutableSubscribableTree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const hashmap = {}
        const type = ObjectDataTypes.TREE_DATA
        hashmap[TREE_ID] = tree
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, type, updatesCallbacks: []})
        const fetchedTree: IMutableSubscribableTree = subscribableStoreSource.get(TREE_ID)
        expect(tree).to.deep.equal(fetchedTree)
    })
    it('set should work', () => {
        const tree: IMutableSubscribableTree =
            myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const hashmap = {}
        const type = ObjectDataTypes.TREE_DATA
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, type, updatesCallbacks: []})
        subscribableStoreSource.set(TREE_ID, tree)
        const fetchedTree: IMutableSubscribableTree  = subscribableStoreSource.get(TREE_ID)
        expect(tree).to.deep.equal(fetchedTree)
    })
    it('set should call callbacks', () => {
        const callback = sinon.spy()
        const tree: IMutableSubscribableTree =
            myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const type = ObjectDataTypes.TREE_DATA
        const hashmap = {}
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, type, updatesCallbacks: [callback]})
        subscribableStoreSource.set(TREE_ID, tree)
        expect(callback.callCount).to.equal(1)
        const calledWith: ITypeAndIdAndValUpdates = callback.getCall(0).args[0]
        expect(calledWith).to.deep.equal({id: TREE_ID, val: tree, type})
    })
})
