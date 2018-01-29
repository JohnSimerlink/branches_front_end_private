import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
const windowAny: any = global
windowAny.requestAnimationFrame = (cb) => cb()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as sinon from 'sinon'
import {
    myContainer, treeLocationsRef, contentRef, contentUsersRef, treeUsersRef,
    treesRef
} from '../../inversify.config';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLoader, TreeLoaderArgs} from '../loaders/tree/TreeLoader';
import {TreeLocationLoader, TreeLocationLoaderArgs} from '../loaders/treeLocation/TreeLocationLoader';
import {
    CONTENT_TYPES, IMutableSubscribableContentStore, IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    INewTreeComponentCreator, IOneToManyMap, ISigma, ISigmaUpdater, ISubscribableContentStoreSource, ITreeDataWithoutId,
    ITreeLocationData
} from '../objects/interfaces';
import {
    IRenderedNodesManager,
    IStoreSourceUpdateListener
} from '../objects/interfaces';
import {
    IHash,
    IRenderedNodesManagerCore,
    ISigmaNode, ISigmaNodesUpdater, IStoreSourceUpdateListenerCore,
} from '../objects/interfaces';
import {ISigmaRenderManager,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource} from '../objects/interfaces';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store2'
import {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} from '../objects/stores/StoreSourceUpdateListener';
import {
    StoreSourceUpdateListenerCore,
    StoreSourceUpdateListenerCoreArgs
} from '../objects/stores/StoreSourceUpdateListenerCore';
import {TYPES} from '../objects/types';
import {TREE_ID} from '../testHelpers/testHelpers';
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
import {error} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
// import GraphData = SigmaJs.GraphData;
import {configureSigma} from '../objects/sigmaNode/configureSigma'
import {log} from './log'
import {OneToManyMap} from '../objects/oneToManyMap/oneToManyMap';
import * as Vue from 'vue';
import * as Vuex from 'vuex'
import {Store} from 'vuex';
import {partialInject} from '../testHelpers/partialInject';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from '../objects/stores/MutableSubscribableGlobalStore';
import {SubscribableTreeStore, SubscribableTreeStoreArgs} from '../objects/stores/tree/SubscribableTreeStore';
import {
    SubscribableContentStore,
    SubscribableContentStoreArgs
} from '../objects/stores/content/SubscribableContentStore';
import {NewTreeComponentCreator, NewTreeComponentCreatorArgs} from '../components/newTree/newTreeComponentCreator';
import newTree from '../components/newTree/newTree';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {SubscribableTreeLocationStoreArgs} from '../objects/stores/treeLocation/SubscribableTreeLocationStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {TreeLoaderAndAutoSaverArgs} from '../loaders/tree/TreeLoaderAndAutoSaver';
import {TreeLocationLoaderAndAutoSaverArgs} from '../loaders/treeLocation/TreeLocationLoaderAndAutoSaver';
import {ContentLoaderArgs} from '../loaders/content/ContentLoader';
import {ContentUserLoaderArgs} from '../loaders/contentUser/ContentUserLoader';
import {ContentLoaderAndAutoSaverArgs} from '../loaders/content/ContentLoaderAndAutoSaver';
import {TreeUserLoaderArgs} from '../loaders/treeUser/TreeUserLoader';
import {ContentUserLoaderAndAutoSaverArgs} from '../loaders/contentUser/ContentUserLoaderAndAutoSaver';
import {AppContainer} from './appContainer';
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

test('App integration test 4 - BranchesStore mutation add new child treeId to parent children set should update the value in the appropriate firebase ref', async (t) => {
    // TODO: use fake firebaseRefs
    // myContainer.unbind<)
    /* TODO: make the test super easy to set up . . .
     e.g. I don't have to set up the subscriptions myself and can just call instance.method() */
    const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES)

    myContainer.unbind(TYPES.FirebaseReference)
    // TreeLoaderAndAutoSaverArgs
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderAndAutoSaverArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentRef)
        .whenInjectedInto(ContentLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treesRef)
        .whenInjectedInto(TreeLoaderAndAutoSaverArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderAndAutoSaverArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentRef)
        .whenInjectedInto(ContentLoaderAndAutoSaverArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentUsersRef)
        .whenInjectedInto(ContentUserLoaderAndAutoSaverArgs)

    // myContainer.unbind(TYPES.ITreeLoader)

    const parentTreeId = '1934879abcd19823'
    const childTreeId = '12498732578'
    const parentTreeRef = mockTreesRef.child(parentTreeId)
    const parentTreeChildrenPropertyRef = parentTreeRef.child('children')
    // const
    log('GlobalDataStore just created')
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>

    const parentTreeChildrenPropertyRefUpdateSpy = sinon.spy(parentTreeChildrenPropertyRef, 'update')
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId})

    expect(parentTreeChildrenPropertyRefUpdateSpy.callCount).to.deep.equal(1)

    t.pass()
})
