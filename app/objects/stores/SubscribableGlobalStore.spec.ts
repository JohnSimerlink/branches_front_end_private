import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {log} from '../../core/log'
import {MutableSubscribableContentUser} from '../contentUser/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    ContentUserPropertyMutationTypes, ContentUserPropertyNames,
    FieldMutationTypes, IIdProppedDatedMutation, IMutableSubscribableContentUser, IMutableSubscribableTree,
    IProppedDatedMutation, ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore,
    ISubscribableMutableField,
    ISubscribableMutableStringSet, ISubscribableTreeLocationStore, ISubscribableTreeStore, ISubscribableTreeUserStore,
    TreePropertyNames
} from '../interfaces';
import {ObjectDataTypes} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../tree/MutableSubscribableTree';
import {SubscribableTree} from '../tree/SubscribableTree';
import {TYPES} from '../types';
import {SubscribableGlobalStore, SubscribableGlobalStoreArgs} from './SubscribableGlobalStore';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoader';

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
    const contentId = new SubscribableMutableField<string>()
    const parentId = new SubscribableMutableField<string>()
    const children = new SubscribableMutableStringSet()
    const TREE_ID = 'efa123'
    const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
    // const tree = myContainer.get<ISubscribableTree>(TYPES.ISubscribableTree)
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    /* const treeStore = myContainer.get<ISubscribableStore<ISubscribableTreeCore>>
    (TYPES.ISubscribableStore_ISubscribableTreeCore)
    */
    // TODO: ^^ The above dependency injection fails . . . So I am using constructor manually
    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const treeUserStore: ISubscribableTreeUserStore
        = myContainer.get<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore)

    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore)

    const contentStore: ISubscribableContentStore
        = myContainer.get<ISubscribableContentStore>(TYPES.ISubscribableContentStore)

    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)

    const globalStore: ISubscribableGlobalStore = new SubscribableGlobalStore({
        treeStore,
        treeUserStore,
        treeLocationStore,
        contentUserStore,
        contentStore,
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
    const contentId: ISubscribableMutableField<string> = new SubscribableMutableField<string>()
    const parentId: ISubscribableMutableField<string> = new SubscribableMutableField<string>()
    const children: ISubscribableMutableStringSet = new SubscribableMutableStringSet()
    const TREE_ID = 'efa123'

    const tree: IMutableSubscribableTree = new MutableSubscribableTree({
        children,
        contentId,
        id: TREE_ID,
        parentId,
        updatesCallbacks: [],
    })
    /* const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>
    (TYPES.ISubscribableTreeStore)
    TODO: ^^^^ Using DI for treeStore causes some sort of error where
     a canvasUI tries to subscribe to the tree storeSource
     . . . how does that even happen?? how is there knowledge of a canvasUI storeSource? */

    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const treeUserStore: ISubscribableTreeUserStore
        = myContainer.get<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore)

    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore)

    const contentStore: ISubscribableContentStore
        = myContainer.get<ISubscribableContentStore>(TYPES.ISubscribableContentStore)

    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)

    // TODO FINISH UPDATING THIS FILE
    const globalStore: ISubscribableGlobalStore = new SubscribableGlobalStore(
        {
            contentStore,
            contentUserStore,
            treeStore,
            treeLocationStore,
            treeUserStore,
            updatesCallbacks: [],
        }
    )

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    globalStore.startPublishing()
    treeStore.startPublishing()

    treeStore.addAndSubscribeToItem(TREE_ID, tree)

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
    const overdue: ISubscribableMutableField<boolean> = new SubscribableMutableField<boolean>()
    const lastRecordedStrength: ISubscribableMutableField<number> = new SubscribableMutableField<number>()
    const proficiency: ISubscribableMutableField<PROFICIENCIES> = new SubscribableMutableField<PROFICIENCIES>()
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>()
    const contentUser: IMutableSubscribableContentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })

    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const treeUserStore: ISubscribableTreeUserStore
        = myContainer.get<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore)

    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore)

    const contentStore: ISubscribableContentStore
        = myContainer.get<ISubscribableContentStore>(TYPES.ISubscribableContentStore)

    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)

    const globalStore: ISubscribableGlobalStore = new SubscribableGlobalStore(
        {
            contentStore,
            contentUserStore,
            treeStore,
            treeLocationStore,
            treeUserStore,
            updatesCallbacks: [],
        }
    )

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    globalStore.startPublishing()
    contentUserStore.startPublishing()
    contentUser.startPublishing()

    contentUserStore.addAndSubscribeToItem(contentId, contentUser)

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
    const contentId: ISubscribableMutableField<string> = new SubscribableMutableField<string>()
    const parentId: ISubscribableMutableField<string> = new SubscribableMutableField<string>()
    const children: ISubscribableMutableStringSet = new SubscribableMutableStringSet()
    const TREE_ID = 'efa123'

    const tree: IMutableSubscribableTree = new MutableSubscribableTree({
        children,
        contentId,
        id: TREE_ID,
        parentId,
        updatesCallbacks: [],
    })

    const treeStore: ISubscribableTreeStore = myContainer.get<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore)

    const treeUserStore: ISubscribableTreeUserStore
        = myContainer.get<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore)

    const treeLocationStore: ISubscribableTreeLocationStore
        = myContainer.get<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore)

    const contentStore: ISubscribableContentStore
        = myContainer.get<ISubscribableContentStore>(TYPES.ISubscribableContentStore)

    const contentUserStore: ISubscribableContentUserStore
        = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)
    const globalStore: ISubscribableGlobalStore = new SubscribableGlobalStore(
        {
            contentStore,
            contentUserStore,
            treeStore,
            treeLocationStore,
            treeUserStore,
            updatesCallbacks: [],
        }
    )

    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    globalStore.onUpdate(callback2)
    globalStore.onUpdate(callback1)

    treeStore.startPublishing()

    treeStore.addAndSubscribeToItem(TREE_ID, tree)

    const sampleMutation = myContainer.get<IProppedDatedMutation<FieldMutationTypes,
        TreePropertyNames>>(TYPES.IProppedDatedMutation)
    tree.addMutation(sampleMutation)

    expect(callback1.callCount).to.equal(0)
    expect(callback2.callCount).to.equal(0)
    t.pass()
})
