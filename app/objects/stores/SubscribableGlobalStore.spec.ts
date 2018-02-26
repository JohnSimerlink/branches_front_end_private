import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {log} from '../../core/log'
import {MutableSubscribableContentUser} from '../contentUser/MutableSubscribableContentUser';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    ContentUserPropertyMutationTypes, ContentUserPropertyNames,
    FieldMutationTypes, IIdProppedDatedMutation, IMutableSubscribableContentUser, IMutableSubscribableTree,
    IProppedDatedMutation, ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore,
    IMutableSubscribableField,
    ISubscribableMutableStringSet, ISubscribableTreeLocationStore, ISubscribableTreeStore, ISubscribableTreeUserStore,
    TreePropertyNames
} from '../interfaces';
import {ObjectDataTypes} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../tree/MutableSubscribableTree';
import {SubscribableTree, SubscribableTreeArgs} from '../tree/SubscribableTree';
import {TYPES} from '../types';
import {SubscribableGlobalStore, SubscribableGlobalStoreArgs} from './SubscribableGlobalStore';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {partialInject} from '../../testHelpers/partialInject';
import {SubscribableContentUserArgs} from '../contentUser/SubscribableContentUser';

myContainerLoadAllModules()
test('ISubscribableGlobalStore::::Dependency injection should set all properties in constructor', (t) => {
    
    const expectedProperties = Object.getOwnPropertyNames
    (myContainer.get<SubscribableGlobalStoreArgs>(TYPES.SubscribableGlobalStoreArgs))
    const store: ISubscribableGlobalStore =
        myContainer.get<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore)
    expectedProperties.forEach(property => {
        expect(store[property]).to.not.equal(undefined)
    })
    t.pass()
})
test('ISubscribableGlobalStore:::: calling startPublishing on GlobalStore,' +
    ' should call onUpdate on each of the component Stores', (t) => {
    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)

    const globalStore: ISubscribableGlobalStore =
        partialInject<SubscribableGlobalStoreArgs>({
            konstructor: SubscribableGlobalStore,
            constructorArgsType: TYPES.SubscribableGlobalStoreArgs,
            injections: {
                treeStore,
                contentUserStore,
            },
            container: myContainer,
        })

    const treeStoreOnUpdateSpy = sinon.spy(treeStore, 'onUpdate')
    const contentUserStoreOnUpdateSpy = sinon.spy(contentUserStore, 'onUpdate')

    expect(treeStoreOnUpdateSpy.callCount).to.equal(0)
    expect(contentUserStoreOnUpdateSpy.callCount).to.equal(0)
    globalStore.startPublishing()
    expect(treeStoreOnUpdateSpy.callCount).to.equal(1)
    expect(contentUserStoreOnUpdateSpy.callCount).to.equal(1)
    t.pass()
})

test('ISubscribableGlobalStore::::After calling startPublishing, globalStore should publish updates'
    + ' when one of its component stores (treeStore) publishes an update', (t) => {
    const TREE_ID = 'efa123'

    const tree: IMutableSubscribableTree
        = partialInject<SubscribableTreeArgs>({
        konstructor: MutableSubscribableTree,
        constructorArgsType: TYPES.SubscribableTreeArgs,
        injections: {
            id: TREE_ID,
        },
        container: myContainer,
    })

    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const globalStore: ISubscribableGlobalStore =
        partialInject<SubscribableGlobalStoreArgs>({
            konstructor: SubscribableGlobalStore,
            constructorArgsType: TYPES.SubscribableGlobalStoreArgs,
            injections: {
                treeStore,
            },
            container: myContainer,
        })

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    globalStore.startPublishing()

    treeStore.addItem(TREE_ID, tree)

    const sampleMutation = myContainer.get<IProppedDatedMutation<FieldMutationTypes,
        TreePropertyNames>>(TYPES.IProppedDatedMutation)
    tree.addMutation(sampleMutation)

    const treeNewVal = tree.val()
    expect(callback1.callCount).to.equal(1)
    expect(callback1.getCall(0).args[0].id).to.equal(TREE_ID)
    expect(callback1.getCall(0).args[0].val).to.deep.equal(treeNewVal)
    expect(callback1.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.TREE_DATA)
    expect(callback2.callCount).to.equal(1)
    expect(callback2.getCall(0).args[0].id).to.equal(TREE_ID)
    expect(callback2.getCall(0).args[0].val).to.deep.equal(treeNewVal)
    expect(callback2.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.TREE_DATA)
    t.pass()
})

test('ISubscribableGlobalStore::::After calling startPublishing, globalStore should publish updates'
    + ' when one of its component stores (contentUserStore) publishes an update', (t) => {
    const contentId = 'efa123'
    const userId = 'abcd12354'

    const contentUserId = getContentUserId({contentId, userId})
    const contentUser: IMutableSubscribableContentUser
        = partialInject<SubscribableContentUserArgs>({
        konstructor: MutableSubscribableContentUser,
        constructorArgsType: TYPES.SubscribableContentUserArgs,
        injections: {
            id: contentUserId,
        },
        container: myContainer
    })
    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)

    const globalStore: ISubscribableGlobalStore =
        partialInject<SubscribableGlobalStoreArgs>({
            konstructor: SubscribableGlobalStore,
            constructorArgsType: TYPES.SubscribableGlobalStoreArgs,
            injections: {
                contentUserStore,
            },
            container: myContainer,
        })

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    globalStore.startPublishing()

    contentUserStore.addItem(contentId, contentUser)

    const sampleMutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: PROFICIENCIES.THREE,
        id: contentId,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    contentUser.addMutation(sampleMutation)

    const contentUserNewVal = contentUser.val()
    expect(callback1.callCount).to.equal(1)
    expect(callback1.getCall(0).args[0].id).to.equal(contentId)
    expect(callback1.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    expect(callback1.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.CONTENT_USER_DATA)
    expect(callback2.callCount).to.equal(1)
    expect(callback2.getCall(0).args[0].id).to.equal(contentId)
    expect(callback2.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    expect(callback2.getCall(0).args[0].type).to.deep.equal(ObjectDataTypes.CONTENT_USER_DATA)
    t.pass()
})

//
test('ISubscribableGlobalStore::::Before calling startPublishing, globalStore should NOT publish updates ' +
    ' when one of its component stores publishes an update', (t) => {
    const TREE_ID = 'efa123'

    const tree: IMutableSubscribableTree =
        partialInject<SubscribableTreeArgs>({
            konstructor: MutableSubscribableTree,
            constructorArgsType: TYPES.SubscribableTreeArgs,
            injections: {
                id: TREE_ID
            },
            container: myContainer
        })

    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)
    const globalStore: ISubscribableGlobalStore
        = partialInject<SubscribableGlobalStoreArgs>({
        konstructor: SubscribableGlobalStore,
        constructorArgsType: TYPES.SubscribableGlobalStoreArgs,
        injections: {
            treeStore,
        },
        container: myContainer,
    })

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    treeStore.startPublishing()

    treeStore.addItem(TREE_ID, tree)

    const sampleMutation = myContainer.get<IProppedDatedMutation<FieldMutationTypes,
        TreePropertyNames>>(TYPES.IProppedDatedMutation)
    tree.addMutation(sampleMutation)

    expect(callback1.callCount).to.equal(0)
    expect(callback2.callCount).to.equal(0)
    t.pass()
})
