import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {IMutableSubscribableTree, ISubscribableStoreSource} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableStoreSource, SubscribableStoreSourceArgs} from './SubscribableStoreSource';

describe('SubscribableStoreSource', () => {
    // it('Dependency injection should set all properties in constructor', () => {
    //     const injects: boolean = injectionWorks<SubscribableStoreSourceArgs, ISubscribableStoreSource>({
    //         container: myContainer,
    //         argsType: TYPES.MutableSubscribableGlobalStoreArgs,
    //         classType: TYPES.IMutableSubscribableGlobalStore
    //     })
    //     expect(injects).to.equal(true)
    // })
    it('get should work', () => {
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const hashmap = {}
        hashmap[TREE_ID] = tree
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, updatesCallbacks: []})
        const fetchedTree = subscribableStoreSource.get(TREE_ID)
        expect(tree).to.deep.equal(fetchedTree)
    })
    it('set should work', () => {
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const hashmap = {}
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, updatesCallbacks: []})
        subscribableStoreSource.set(TREE_ID, tree)
        const fetchedTree = subscribableStoreSource.get(TREE_ID)
        expect(tree).to.deep.equal(fetchedTree)
    })
    it('set should call callbacks', () => {
        const callback = sinon.spy()
        const tree = myContainer.get<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree)
        const hashmap = {}
        const subscribableStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = new SubscribableStoreSource({hashmap, updatesCallbacks: [callback]})
        subscribableStoreSource.set(TREE_ID, tree)
        expect(callback.callCount).to.equal(1)
        const calledWith = callback.getCall(0).args[0]
        expect(calledWith).to.deep.equal({id: TREE_ID, val: tree})
    })
})
