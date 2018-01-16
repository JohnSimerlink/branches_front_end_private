import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock'
import {Container, interfaces} from 'inversify';
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {INITIAL_ID_TO_DOWNLOAD} from '../../core/globals';
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store2';
import {FIREBASE_PATHS} from '../../loaders/paths';
import Reference = firebase.database.Reference;
import {TreeLoaderArgs} from '../../loaders/tree/TreeLoader';
import {
    IContentLoader, IContentUserLoader, IVueComponentCreator, ITreeLoader,
    ITreeLocationLoader, IKnawledgeMapCreator, ITree, ITree3CreatorClone, IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore, IMutableSubscribableTreeLocationStore,
    IMutableSubscribableContentStore, IMutableSubscribableContentUserStore
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {Tree3CreatorClone, Tree3CreatorCloneArgs} from './tree3Component';
import {TreeLocationLoaderArgs} from '../../loaders/treeLocation/TreeLocationLoader';
import {ContentLoaderArgs} from '../../loaders/content/ContentLoader';
import {ContentUserLoaderArgs} from '../../loaders/contentUser/ContentUserLoader';
import {TreeUserLoaderArgs} from '../../loaders/treeUser/TreeUserLoader';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {log} from '../../core/log'
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {MutableSubscribableGlobalStore} from '../../objects/stores/MutableSubscribableGlobalStore';
let Vue = require('vue').default // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
// import register from 'ignore-styles'
// process.env.node_ENV = 'test' && register(['.html'])

test('knawledeMap DI constructor should work', t => {
    const injects = injectionWorks<Tree3CreatorCloneArgs, ITree3CreatorClone >({
        container: myContainer,
        argsType: TYPES.Tree3CreatorCloneArgs,
        interfaceType: TYPES.ITree3CreatorClone,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test.beforeEach((t) => {
    myContainer.snapshot()
    const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const mockTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS)
    const mockContentRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const mockContentUsersRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
    const mockTreeUsersRef = new MockFirebase(FIREBASE_PATHS.TREE_USERS)
    myContainer.unbind(TYPES.FirebaseReference)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenInjectedInto(ContentLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)
})
test.afterEach(t => {
    myContainer.snapshot()
})

// test('KnawledgeMap::::create tree3Creator should work', (t) => {
//     const treeLoader: ITreeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
//     const treeLoaderDownloadDataSpy = sinon.spy(treeLoader, 'downloadData')
//     const treeLocationLoader: ITreeLocationLoader = myContainer.get<ITreeLocationLoader>(TYPES.ITreeLocationLoader)
//     const treeLocationLoaderDownloadDataSpy = sinon.spy(treeLocationLoader, 'downloadData')
//     const contentLoader: IContentLoader = myContainer.get<IContentLoader>(TYPES.IContentLoader)
//     const contentLoaderDownloadDataSpy = sinon.spy(contentLoader, 'downloadData')
//     const contentUserLoader: IContentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader)
//     const contentUserLoaderDownloadDataSpy = sinon.spy(contentUserLoader, 'downloadData')
//     const userId = '4324324abc'
//     const store = {
//         commit() {}
//     }
//     const storeCommitSpy = sinon.spy(store, 'commit')
//     const tree3CreatorCreator: IVueComponentCreator
//         = new Tree3CreatorClone({treeLoader, treeLocationLoader, contentLoader, contentUserLoader, userId, store})
//     const tree3Creator = tree3CreatorCreator.create()
//
//     expect(treeLoaderDownloadDataSpy.callCount).to.equal(0)
//     tree3Creator.mounted()
//     expect(treeLoaderDownloadDataSpy.callCount).to.equal(2)
//     let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0]
//     const expectedCalledWith = INITIAL_ID_TO_DOWNLOAD
//     expect(calledWith).to.equal(expectedCalledWith)
//
//     expect(storeCommitSpy.callCount).to.equal(1)
//     calledWith = storeCommitSpy.getCall(0).args[0]
//     expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
//
//     t.pass()
// })

test('KnawledgeMap::::trying to create and mount component VueJS style', (t) => {
    const contentId = 'abc123'
    const userId = 'bdd123'
    const treeStore: IMutableSubscribableTreeStore
        = myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

    const treeUserStore: IMutableSubscribableTreeUserStore
        = myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

    const treeLocationStore: IMutableSubscribableTreeLocationStore
        = myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

    const contentStore: IMutableSubscribableContentStore
        = myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

    const contentUserStore = {} as IMutableSubscribableContentUserStore
    contentUserStore.addMutation = () => {}
    // const contentUserStore
    //     = {
    //     addMutation() {},
    //     onUpdate(),
    //     addAndSubscribeToItem(),
    //     startPublishing(),
    //     mutations: [],
    // } as IMutableSubscribableContentUserStore
    const globalDataStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
        {
            contentStore,
            contentUserStore,
            treeStore,
            treeLocationStore,
            treeUserStore,
            updatesCallbacks: [],
        }
    )
    const store: BranchesStore = new BranchesStore({globalDataStore})
    const storeCommitSpy = sinon.spy(store, 'commit')
    const tree3CreatorCreator: ITree3CreatorClone
        = new Tree3CreatorClone(
            {store}
            )
    const KnawledgeMapComponent = tree3CreatorCreator.create()
    const Constructor = Vue.extend(KnawledgeMapComponent)
    // const instance = new Constructor({propsData}).$mount()
    const propsData = {
        contentId,
        userId,
    }
    const proficiency = PROFICIENCIES.TWO
    const instance = new Constructor({propsData})
    log('instance props are ', instance.$props)
    instance.$createElement()
    instance.$mount()
    instance.aMethod()
    instance.proficiencyClicked(proficiency)
    expect(storeCommitSpy.callCount).to.deep.equal(1)
    const commitArg0 = storeCommitSpy.getCall(0).args[0]
    const commitArg1 = storeCommitSpy.getCall(0).args[1]
    expect(commitArg0).to.deep.equal(MUTATION_NAMES.ADD_CONTENT_INTERACTION)
    expect(commitArg1.userId).to.deep.equal(userId)
    expect(commitArg1.contentId).to.deep.equal(contentId)
    expect(commitArg1.proficiency).to.deep.equal(proficiency)
    // log('instance in knawldegMapSPEC is', instance)
    // instance.methods.proficiencyClicked()

    t.pass()
})
