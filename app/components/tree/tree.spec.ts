import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {BranchesStoreArgs, default as BranchesStore, MUTATION_NAMES} from '../../core/store';
import {FIREBASE_PATHS} from '../../loaders/paths';
import Reference = firebase.database.Reference;
import {TreeLoaderArgs} from '../../loaders/tree/TreeLoader';
import {
    ITreeCreator, IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore, IMutableSubscribableTreeLocationStore,
    IMutableSubscribableContentStore, IMutableSubscribableContentUserStore
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {TreeCreator, TreeCreatorArgs} from './tree';
import {TreeLocationLoaderArgs} from '../../loaders/treeLocation/TreeLocationLoader';
import {ContentLoaderArgs} from '../../loaders/content/ContentLoader';
import {ContentUserLoaderArgs} from '../../loaders/contentUser/ContentUserLoader';
import {TreeUserLoaderArgs} from '../../loaders/treeUser/TreeUserLoader';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {log} from '../../core/log'
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {MutableSubscribableGlobalStore} from '../../objects/stores/MutableSubscribableGlobalStore';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {Store} from 'vuex';
import {partialInject} from '../../testHelpers/partialInject';
let Vue = require('vue').default; // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
// import register from 'ignore-styles'
// process.env.node_ENV = 'test' && register(['.html'])

myContainerLoadAllModules();
test('TreeComponent DI constructor should work', t => {
    const injects = injectionWorks<TreeCreatorArgs, ITreeCreator >({
        container: myContainer,
        argsType: TYPES.TreeCreatorArgs,
        interfaceType: TYPES.ITreeCreator,
    });
    expect(injects).to.equal(true);
    t.pass()
});
test.beforeEach((t) => {
    myContainer.snapshot();
    const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const mockTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
    const mockContentRef = new MockFirebase(FIREBASE_PATHS.CONTENT);
    const mockContentUsersRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS);
    const mockTreeUsersRef = new MockFirebase(FIREBASE_PATHS.TREE_USERS);
    myContainer.unbind(TYPES.FirebaseReference);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenInjectedInto(ContentLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)
});
test.afterEach(t => {
    myContainer.snapshot()
});

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
//         = new TreeCreator({treeLoader, treeLocationLoader, contentLoader, contentUserLoader, userId, store})
//     const tree3Creator = tree3CreatorCreator.create()
//
//     expect(treeLoaderDownloadDataSpy.callCount).to.equal(0)
//     tree3Creator.mounted()
//     expect(treeLoaderDownloadDataSpy.callCount).to.equal(2)
//     let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0]
//     const expectedCalledWith = INITIAL_TREE_ID_TO_DOWNLOAD
//     expect(calledWith).to.equal(expectedCalledWith)
//
//     expect(storeCommitSpy.callCount).to.equal(1)
//     calledWith = storeCommitSpy.getCall(0).args[0]
//     expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED)
//
//     t.pass()
// })

test('TreeComponent::::trying to create and mount component VueJS style', (t) => {
    const contentId = 'abc123';
    const userId = 'bdd123';
    const treeStore: IMutableSubscribableTreeStore
        = myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore);

    const treeUserStore: IMutableSubscribableTreeUserStore
        = myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore);

    const treeLocationStore: IMutableSubscribableTreeLocationStore
        = myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore);

    const contentStore: IMutableSubscribableContentStore
        = myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore);

    const contentUserStore = {} as IMutableSubscribableContentUserStore;
    contentUserStore.addMutation = () => {};
    const globalDataStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
        {
            contentStore,
            contentUserStore,
            treeStore,
            treeLocationStore,
            treeUserStore,
            updatesCallbacks: [],
        }
    );
    const state: object = myContainer.get<object>(TYPES.BranchesStoreState);
    const store: Store<any> =
        partialInject<BranchesStoreArgs>({
            konstructor: BranchesStore,
            constructorArgsType: TYPES.BranchesStoreArgs,
            injections: {
                globalDataStore,
            },
            container: myContainer
        });
        // new BranchesStore({globalDataStore, state}) as Store<any>
    const storeCommitSpy = sinon.spy(store, 'commit');
    const tree3CreatorCreator: ITreeCreator
        = new TreeCreator(
            {store}
            );
    const TreeComponent = tree3CreatorCreator.create();
    const Constructor = Vue.extend(TreeComponent);
    // const instance = new Constructor({propsData}).$mount()
    const contentUserId = getContentUserId({contentId, userId});
    const propsData = {
        contentUserId
    };
    const proficiency = PROFICIENCIES.TWO;
    const instance = new Constructor({propsData});
    log('instance props are ', instance.$props);
    instance.$createElement();
    instance.$mount();
    instance.aMethod();
    instance.proficiencyClicked(proficiency);
    expect(storeCommitSpy.callCount).to.deep.equal(1);
    const commitArg0 = storeCommitSpy.getCall(0).args[0];
    const commitArg1 = storeCommitSpy.getCall(0).args[1];
    expect(commitArg0).to.deep.equal(MUTATION_NAMES.ADD_CONTENT_INTERACTION);
    expect(commitArg1.contentUserId).to.deep.equal(contentUserId);
    expect(commitArg1.proficiency).to.deep.equal(proficiency);
    const timestampUndefined = !commitArg1.timestamp;
    expect(timestampUndefined).to.equal(false);
    // log('instance in knawldegMapSPEC is', instance)
    // instance.methods.proficiencyClicked()

    t.pass()
});
