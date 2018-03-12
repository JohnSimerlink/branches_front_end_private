import * as firebase from 'firebase';
import {log} from './app/core/log'
import './other_imports/sigmaConfigurations'
import sigma from './other_imports/sigma/sigma.core.js'
import {Container, ContainerModule, injectable, interfaces} from 'inversify'
import 'reflect-metadata'
import {MockFirebase} from 'firebase-mock'
import {App, AppArgs} from './app/core/app';
import {FIREBASE_PATHS} from './app/loaders/paths';
import {TreeLoader, TreeLoaderArgs} from './app/loaders/tree/TreeLoader';
import {TreeLocationLoader, TreeLocationLoaderArgs} from './app/loaders/treeLocation/TreeLocationLoader';
import {SubscribableContent, SubscribableContentArgs} from './app/objects/content/SubscribableContent';
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUser/ContentUserData';
import {
    SubscribableContentUser,
    SubscribableContentUserArgs
} from './app/objects/contentUser/SubscribableContentUser';
import {PropertyFirebaseSaverArgs} from './app/objects/dbSync/PropertyFirebaseSaver';
import {PropertyAutoFirebaseSaver, PropertyAutoFirebaseSaverArgs} from './app/objects/dbSync/PropertyAutoFirebaseSaver';
import {
    MutableSubscribableField,
    MutableSubscribableFieldArgs
} from './app/objects/field/MutableSubscribableField';
import firebaseDevConfig = require('./app/objects/firebase.dev.config.json')
import Reference = firebase.database.Reference;
// import firebase from './app/objects/firebaseService.js'
import {
    FieldMutationTypes, IColorSlice, IContentLoader, IContentUserData, IDatabaseAutoSaver, IDetailedUpdates,
    IMutableStringSet, IMutableSubscribableContent, IMutableSubscribableContentUser,
    INewTreeComponentCreator, IOneToManyMap,
    IProficiencyStats,
    IProppedDatedMutation,
    // ITree2ComponentCreator,
    ISaveUpdatesToDBFunction, ISigma,
    ISigmaNode, ISubscribableContentUser,
    IMutableSubscribableField, ISubscribableMutableStringSet, ISyncable, ISyncableMutableSubscribableContentUser,
    ISyncableMutableSubscribableTree, ISyncableMutableSubscribableTreeLocation,
    ITooltipOpener, ITooltipRenderer, ITree,
    ITreeCreator,
    ITreeComponentCreator,
    ITreeUserLoader, IVuexStore,
    radian,
    TreePropertyNames,
    ISyncableMutableSubscribableContent, id, ISigmaNodes, IVueConfigurer, IUI, ISigmaNodeLoader, ISigmaNodeLoaderCore,
    IFamilyLoader,
    IFamilyLoaderCore, ISigmaEdgesUpdater, ISigmaEdges, SetMutationTypes, IState, IUserLoader, IUserUtils,
    IAuthListener, IGlobalDataStoreBranchesStoreSyncer, IKnawledgeMapCreator, IBranchesMapLoader,
    IBranchesMapLoaderCore, IBranchesMapUtils,
} from './app/objects/interfaces';
import {
    IApp,
    IDatedMutation, IDBSubscriberToTree, IDBSubscriberToTreeLocation, IMutableSubscribablePoint,
    IStoreSourceUpdateListenerCore,
    ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource, ISubscribableTreeLocation, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource,
    ISubscribableTreeUserStoreSource, ISyncableMutableSubscribableTreeUser, ITreeLoader, ITreeLocationLoader,
    GlobalStoreObjectDataTypes
} from './app/objects/interfaces';
import {
    CONTENT_TYPES,
    fGetSigmaIdsForContentId, IMutableSubscribableContentStore,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore, IMutableSubscribableTree,
    IMutableSubscribableTreeLocation, IMutableSubscribableTreeLocationStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore, IRenderManager, IRenderManagerCore,
    ISigmaNodesUpdater,
    ISigmaRenderManager,
    IStoreSourceUpdateListener, ISubscribableContent,
    ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore, ISubscribableTree, ISubscribableTreeLocationStore,
    ISubscribableTreeStore,
    ISubscribableTreeUser,
    ISubscribableTreeUserStore,
    ISigmaUpdater,
    IContentUserLoader,
    IMutableSubscribableTreeUser,
} from './app/objects/interfaces';
import {MutableSubscribablePoint, MutableSubscribablePointArgs} from './app/objects/point/MutableSubscribablePoint';
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {defaultProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {
    CanvasUI,
    CanvasUIArgs
} from './app/objects/sigmaNode/CanvasUI';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {RenderManager, RenderManagerArgs} from './app/objects/sigmaNode/RenderManager';
import {RenderManagerCore, RenderManagerCoreArgs} from './app/objects/sigmaNode/RenderManagerCore';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from './app/objects/sigmaNode/SigmaNodesUpdater';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './app/objects/sigmaNode/SigmaRenderManager';
import {MutableSubscribableContentStore} from './app/objects/stores/content/MutableSubscribableContentStore';
import {
    SubscribableContentStore,
    SubscribableContentStoreArgs
} from './app/objects/stores/content/SubscribableContentStore';
import {
    MutableSubscribableContentUserStore
} from './app/objects/stores/contentUser/MutableSubscribableContentUserStore';
import {
    SubscribableContentUserStore,
    SubscribableContentUserStoreArgs
} from './app/objects/stores/contentUser/SubscribableContentUserStore';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from './app/objects/stores/MutableSubscribableGlobalStore';
import {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} from './app/objects/stores/StoreSourceUpdateListener';
import {
    StoreSourceUpdateListenerCore,
    StoreSourceUpdateListenerCoreArgs
} from './app/objects/stores/StoreSourceUpdateListenerCore';
import {SubscribableGlobalStore, SubscribableGlobalStoreArgs} from './app/objects/stores/SubscribableGlobalStore';
import {
    SubscribableContentStoreSource, SubscribableContentStoreSourceArgs,
    SubscribableContentUserStoreSource, SubscribableContentUserStoreSourceArgs,
    SubscribableStoreSourceArgs, SubscribableTreeLocationStoreSource,
    SubscribableTreeLocationStoreSourceArgs,
    SubscribableTreeStoreSource,
    SubscribableTreeStoreSourceArgs, SubscribableTreeUserStoreSource, SubscribableTreeUserStoreSourceArgs
} from './app/objects/stores/SubscribableStoreSource';
import {MutableSubscribableTreeStore} from './app/objects/stores/tree/MutableSubscribableTreeStore';
import {SubscribableTreeStore, SubscribableTreeStoreArgs} from './app/objects/stores/tree/SubscribableTreeStore';
import {
    MutableSubscribableTreeLocationStore
} from './app/objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {
    SubscribableTreeLocationStore,
    SubscribableTreeLocationStoreArgs
} from './app/objects/stores/treeLocation/SubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from './app/objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {
    SubscribableTreeUserStore,
    SubscribableTreeUserStoreArgs
} from './app/objects/stores/treeUser/SubscribableTreeUserStore';
import {SubscribableArgs} from './app/objects/subscribable/Subscribable';
// import {DBSubscriberToTree, DBSubscriberToTreeArgs} from './app/objects/tree/DBSubscriberToTree';
import {MutableSubscribableTree} from './app/objects/tree/MutableSubscribableTree';
import {SubscribableTree, SubscribableTreeArgs} from './app/objects/tree/SubscribableTree';
// import {
//     DBSubscriberToTreeLocation,
//     DBSubscriberToTreeLocationArgs
// } from './app/objects/treeLocation/DBSubscriberToTreeLocation';
import {MutableSubscribableTreeLocation} from './app/objects/treeLocation/MutableSubscribableTreeLocation';
import {
    SubscribableTreeLocation,
    SubscribableTreeLocationArgs
} from './app/objects/treeLocation/SubscribableTreeLocation';
import {SubscribableTreeUser, SubscribableTreeUserArgs} from './app/objects/treeUser/SubscribableTreeUser';
import {TYPES } from './app/objects/types'
import {UIColor} from './app/objects/uiColor';
import { TREE_ID3} from './app/testHelpers/testHelpers';
import {SigmaUpdaterArgs, SigmaUpdater} from './app/objects/sigmaUpdater/sigmaUpdater';
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
import {DEFAULT_MAP_ID, GRAPH_CONTAINER_ID, JOHN_USER_ID, GLOBAL_MAP_ROOT_TREE_ID} from './app/core/globals';
import {ContentLoader, ContentLoaderArgs} from './app/loaders/content/ContentLoader';
import {ContentUserLoader, ContentUserLoaderArgs} from './app/loaders/contentUser/ContentUserLoader';
import {TreeUserLoader, TreeUserLoaderArgs} from './app/loaders/treeUser/TreeUserLoader';
import {MutableSubscribableContent} from './app/objects/content/MutableSubscribableContent';
import {MutableSubscribableTreeUser} from './app/objects/treeUser/MutableSubscribableTreeUser';
import {MutableSubscribableContentUser} from './app/objects/contentUser/MutableSubscribableContentUser';
import {OneToManyMap, OneToManyMapArgs} from './app/objects/oneToManyMap/oneToManyMap';
// import {Tree2ComponentCreator, Tree2ComponentCreatorArgs} from './app/components/tree2Component/treeComponent';
import {default as BranchesStore, BranchesStoreArgs} from './app/core/store';
// import {KnawledgeMapCreatorArgs} from './app/components/knawledgeMap/knawledgeMap';
import {
    TreeCreator,
    // TreeCreatorArgs
} from './app/components/tree/tree';
import {TooltipRenderer, TooltipRendererArgs} from './app/objects/tooltipOpener/tooltipRenderer';
import {TooltipOpener, TooltipOpenerArgs} from './app/objects/tooltipOpener/tooltipOpener';
import {SyncableMutableSubscribableContentUser} from './app/objects/contentUser/SyncableMutableSubscribableContentUser';
import {NewTreeComponentCreator, NewTreeComponentCreatorArgs} from './app/components/newTree/newTree';
import {SyncableMutableSubscribableTree} from './app/objects/tree/SyncableMutableSubscribableTree';
import {SyncableMutableSubscribableTreeLocation} from './app/objects/treeLocation/SyncableMutableSubscribableTreeLocation';
import {SyncableMutableSubscribableContent} from './app/objects/content/SyncableMutableSubscribableContent';
import {SyncableMutableSubscribableTreeUser} from './app/objects/treeUser/SyncableMutableSubscribableTreeUser';
import {SpecialTreeLoader, SpecialTreeLoaderArgs} from './app/loaders/tree/specialTreeLoader';
import {TreeLoaderAndAutoSaver, TreeLoaderAndAutoSaverArgs} from './app/loaders/tree/TreeLoaderAndAutoSaver';
import {
    TreeLocationLoaderAndAutoSaver,
    TreeLocationLoaderAndAutoSaverArgs
} from './app/loaders/treeLocation/TreeLocationLoaderAndAutoSaver';
import {ContentLoaderAndAutoSaverArgs, ContentLoaderAndAutoSaver} from './app/loaders/content/ContentLoaderAndAutoSaver';
import {
    ContentUserLoaderAndAutoSaver,
    ContentUserLoaderAndAutoSaverArgs
} from './app/loaders/contentUser/ContentUserLoaderAndAutoSaver';
import {
    AutoSaveMutableSubscribableContentStore,
    AutoSaveMutableSubscribableContentStoreArgs
} from './app/objects/stores/content/AutoSaveMutableSubscribableContentStore';
import {
    AutoSaveMutableSubscribableContentUserStore,
    AutoSaveMutableSubscribableContentUserStoreArgs
} from './app/objects/stores/contentUser/AutoSaveMutableSubscribableContentUserStore';
import {
    AutoSaveMutableSubscribableTreeStore,
    AutoSaveMutableSubscribableTreeStoreArgs
} from './app/objects/stores/tree/AutoSaveMutableSubscribableTreeStore';
import {
    AutoSaveMutableSubscribableTreeUserStore,
    AutoSaveMutableSubscribableTreeUserStoreArgs
} from './app/objects/stores/treeUser/AutoSaveMutableSubscribableTreeUserStore';
import {
    AutoSaveMutableSubscribableTreeLocationStore,
    AutoSaveMutableSubscribableTreeLocationStoreArgs
} from './app/objects/stores/treeLocation/AutoSaveMutableSubscribableTreeLocationStore';
import {TAGS} from './app/objects/tags';
import {AppContainer, AppContainerArgs} from './app/core/appContainer';
// import {SigmaJs} from 'sigmajs';

let Vue = require('vue').default
if (!Vue) {
    Vue = require('vue')
}
let Vuex = require('vuex').default
if (!Vuex) {
    Vuex = require('vuex')
}
import {VueConfigurer, VueConfigurerArgs} from './app/core/VueConfigurer';
import {SigmaNodeLoader, SigmaNodeLoaderArgs} from './app/loaders/sigmaNode/sigmaNodeLoader';
import {SigmaNodeLoaderCore, SigmaNodeLoaderCoreArgs} from './app/loaders/sigmaNode/sigmaNodeLoaderCore';
import {FamilyLoaderCore, FamilyLoaderCoreArgs} from './app/loaders/sigmaNode/familyLoaderCore';
import {FamilyLoader, FamilyLoaderArgs} from './app/loaders/sigmaNode/familyLoader';
import {SigmaEdgesUpdater, SigmaEdgesUpdaterArgs} from './app/objects/sigmaEdge/sigmaEdgeUpdater';
import {UserLoader, UserLoaderArgs} from './app/loaders/user/UserLoader';
import {UserUtils, UserUtilsArgs} from './app/objects/user/usersUtils';
import {UserLoaderAndAutoSaver, UserLoaderAndAutoSaverArgs} from './app/loaders/user/UserLoaderAndAutoSaver';
import {AuthListener, AuthListenerArgs} from './app/objects/authListener/authListener';
import {
    ContentUserLoaderAndOverdueListener,
    ContentUserLoaderAndOverdueListenerArgs
} from './app/loaders/contentUser/ContentUserLoaderAndOverdueListener';
import {
    OverdueListenerMutableSubscribableContentUserStore,
    OverdueListenerMutableSubscribableContentUserStoreArgs
} from './app/objects/stores/contentUser/OverdueListenerMutableSubscribableContentUserStore';
import {
    GlobalDataStoreBranchesStoreSyncer,
    GlobalDataStoreBranchesStoreSyncerArgs
} from './app/core/globalDataStoreBranchesStoreSyncer';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from './app/components/knawledgeMap/KnawledgeMapNew';
import {BranchesMapLoader, BranchesMapLoaderArgs} from './app/loaders/branchesMap/BranchesMapLoader';
import {BranchesMapLoaderCoreArgs, BranchesMapLoaderCore} from './app/loaders/branchesMap/BranchesMapLoaderCore';
import {BranchesMapUtils, BranchesMapUtilsArgs} from './app/objects/branchesMap/branchesMapUtils';
import {TreeCreatorArgs} from './app/components/tree/tree';

Vue.use(Vuex)

const firebaseConfig = firebaseDevConfig
const myContainer = new Container()

const sigmaInstance /*: Sigma*/ = new sigma({
        graph: {
            nodes: [],
            edges: []
        },
        container: GRAPH_CONTAINER_ID,
        glyphScale: 0.7,
        glyphFillColor: '#666',
        glyphTextColor: 'white',
        glyphStrokeColor: 'transparent',
        glyphFont: 'FontAwesome',
        glyphFontStyle: 'normal',
        glyphTextThreshold: 6,
        glyphThreshold: 3,
    } as any/* as SigmaConfigs*/) as any
// throw new Error('inversify error error error')

// const firebaseConfig = {
//     apiKey: 'AIzaSyCqzA9NxQsKpY4WzKbJf59nvrf-8-60i8A',
//     authDomain: 'branches-dev.firebaseapp.com',
//     databaseURL: 'https://branches-dev.firebaseio.com',
//     projectId: 'branches-dev',
//     storageBucket: 'branches-dev.appspot.com',
//     messagingSenderId: '354929800016'
// }
firebase.initializeApp(firebaseConfig)
export const treesRef = firebase.database().ref(FIREBASE_PATHS.TREES)
export const treeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
export const treeUsersRef = firebase.database().ref(FIREBASE_PATHS.TREE_USERS)
export const contentRef = firebase.database().ref(FIREBASE_PATHS.CONTENT)
export const contentUsersRef = firebase.database().ref(FIREBASE_PATHS.CONTENT_USERS)
export const usersRef = firebase.database().ref(FIREBASE_PATHS.USERS)
export const branchesMapsRef = firebase.database().ref(FIREBASE_PATHS.BRANCHES_MAPS)
export const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES)
export const mockTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS)
export const mockTreeUsersRef = new MockFirebase(FIREBASE_PATHS.TREE_USERS)
export const mockContentRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
export const mockContentUsersRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
export const mockBranchesMapsRef = new MockFirebase(FIREBASE_PATHS.BRANCHES_MAPS)
export const mockUsersRef = new MockFirebase(FIREBASE_PATHS.USERS)
export const firebaseReferences = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treesRef)
        .whenTargetTagged(TAGS.TREES_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeLocationsRef)
        .whenTargetTagged(TAGS.TREE_LOCATIONS_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeUsersRef)
        .whenTargetTagged(TAGS.TREE_USERS_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentRef)
        .whenTargetTagged(TAGS.CONTENT_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentUsersRef)
        .whenTargetTagged(TAGS.CONTENT_USERS_REF, true)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(usersRef)
        .whenTargetTagged(TAGS.USERS_REF, true)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(branchesMapsRef)
        .whenTargetTagged(TAGS.BRANCHES_MAPS_REF, true)
})
export const mockFirebaseReferences = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenTargetTagged(TAGS.TREES_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenTargetTagged(TAGS.TREE_LOCATIONS_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenTargetTagged(TAGS.TREE_USERS_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenTargetTagged(TAGS.CONTENT_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenTargetTagged(TAGS.CONTENT_USERS_REF, true)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockUsersRef)
        .whenTargetTagged(TAGS.USERS_REF, true)

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockBranchesMapsRef)
        .whenTargetTagged(TAGS.BRANCHES_MAPS_REF, true)
})
export const loaders = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    myContainer.bind<TreeLoaderArgs>(TYPES.TreeLoaderArgs).to(TreeLoaderArgs)
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)
        .whenTargetIsDefault()
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(SpecialTreeLoader)
        .whenTargetTagged(TAGS.SPECIAL_TREE_LOADER, true)
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    myContainer.bind<ITreeLocationLoader>(TYPES.ITreeLocationLoader).to(TreeLocationLoader)
        .whenTargetIsDefault()
    myContainer.bind<ITreeLocationLoader>(TYPES.ITreeLocationLoader).to(TreeLocationLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)
    myContainer.bind<TreeLocationLoaderArgs>(TYPES.TreeLocationLoaderArgs).to(TreeLocationLoaderArgs)

    myContainer.bind<IContentLoader>(TYPES.IContentLoader).to(ContentLoader)
        .whenTargetIsDefault()
    myContainer.bind<IContentLoader>(TYPES.IContentLoader).to(ContentLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)
    myContainer.bind<ContentLoaderArgs>(TYPES.ContentLoaderArgs).to(ContentLoaderArgs)

    myContainer.bind<ContentUserLoaderArgs>(TYPES.ContentUserLoaderArgs).to(ContentUserLoaderArgs)
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoader)
        .whenTargetIsDefault()
    myContainer.bind<ContentUserLoaderAndAutoSaverArgs>(TYPES.ContentUserLoaderAndAutoSaverArgs)
        .to(ContentUserLoaderAndAutoSaverArgs)
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)
    myContainer.bind<ContentUserLoaderAndOverdueListenerArgs>(TYPES.ContentUserLoaderAndOverdueListenerArgs)
        .to(ContentUserLoaderAndOverdueListenerArgs)
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoaderAndOverdueListener)
        .whenTargetTagged(TAGS.OVERDUE_LISTENER, true)

    // myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)

    // myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)
    //     .whenInjectedInto(SpecialTreeLoaderArgs)

    myContainer.bind<SpecialTreeLoaderArgs>(TYPES.SpecialTreeLoaderArgs)
        .to(SpecialTreeLoaderArgs)

    // myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(SpecialTreeLoader)
    //     .whenInjectedInto(TreeLoaderAndAutoSaverArgs)

    // myContainer.bind<ITreeLoader>(TYPES.ITreeLoader)
    //     .to(TreeLoaderAndAutoSaver)
    //     .whenInjectedInto(KnawledgeMapCreatorArgs)

    myContainer.bind<ITreeUserLoader>(TYPES.ITreeUserLoader).to(TreeUserLoader)
    myContainer.bind<TreeUserLoaderArgs>(TYPES.TreeUserLoaderArgs).to(TreeUserLoaderArgs)

    myContainer.bind<UserLoaderArgs>(TYPES.UserLoaderArgs).to(UserLoaderArgs)
    myContainer.bind<IUserLoader>(TYPES.IUserLoader).to(UserLoader)
        .whenTargetIsDefault()
    myContainer.bind<UserLoaderAndAutoSaverArgs>(TYPES.UserLoaderAndAutoSaverArgs)
        .to(UserLoaderAndAutoSaverArgs)
    myContainer.bind<IUserLoader>(TYPES.IUserLoader)
        .to(UserLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)
    myContainer.bind<UserUtilsArgs>(TYPES.UserUtilsArgs).to(UserUtilsArgs)
    myContainer.bind<IUserUtils>(TYPES.IUserUtils).to(UserUtils)

    // loaders

    myContainer.bind<BranchesMapLoaderArgs>(TYPES.BranchesMapLoaderArgs).to(BranchesMapLoaderArgs)
    myContainer.bind<IBranchesMapLoader>(TYPES.IBranchesMapLoader).to(BranchesMapLoader)
    myContainer.bind<BranchesMapLoaderCoreArgs>(TYPES.BranchesMapLoaderCoreArgs).to(BranchesMapLoaderCoreArgs)
    myContainer.bind<IBranchesMapLoaderCore>(TYPES.IBranchesMapLoaderCore).to(BranchesMapLoaderCore)

    myContainer.bind<BranchesMapUtilsArgs>(TYPES.BranchesMapUtilsArgs).to(BranchesMapUtilsArgs)
    myContainer.bind<IBranchesMapUtils>(TYPES.IBranchesMapUtils).to(BranchesMapUtils)

    // loader auto savers

    myContainer.bind<TreeLoaderAndAutoSaverArgs>(TYPES.TreeLoaderAndAutoSaverArgs).to(TreeLoaderAndAutoSaverArgs)

        // .whenInjectedInto(TreeLoaderAndAutoSaverArgs)
    myContainer.bind<ContentLoaderAndAutoSaverArgs>(TYPES.ContentLoaderAndAutoSaverArgs)
        .to(ContentLoaderAndAutoSaverArgs)
    myContainer.bind<TreeLocationLoaderAndAutoSaverArgs>(TYPES.TreeLocationLoaderAndAutoSaverArgs)
        .to(TreeLocationLoaderAndAutoSaverArgs)

    myContainer.bind<SigmaNodeLoaderCoreArgs>(TYPES.SigmaNodeLoaderCoreArgs).to(SigmaNodeLoaderCoreArgs)
    myContainer.bind<ISigmaNodeLoaderCore>(TYPES.ISigmaNodeLoaderCore).to(SigmaNodeLoaderCore)
        .inSingletonScope()
        .whenTargetIsDefault()
    myContainer.bind<SigmaNodeLoaderArgs>(TYPES.SigmaNodeLoaderArgs).to(SigmaNodeLoaderArgs)
    myContainer.bind<ISigmaNodeLoader>(TYPES.ISigmaNodeLoader).to(SigmaNodeLoader)
        .inSingletonScope()
        .whenTargetIsDefault()

    myContainer.bind<IFamilyLoader>(TYPES.IFamilyLoader).to(FamilyLoader)
    myContainer.bind<FamilyLoaderArgs>(TYPES.FamilyLoaderArgs).to(FamilyLoaderArgs)
    myContainer.bind<IFamilyLoaderCore>(TYPES.IFamilyLoaderCore).to(FamilyLoaderCore)
    myContainer.bind<FamilyLoaderCoreArgs>(TYPES.FamilyLoaderCoreArgs).to(FamilyLoaderCoreArgs)

})
const subscribableTreeStoreSourceSingleton: ISubscribableTreeStoreSource
    = new SubscribableTreeStoreSource({hashmap: {}, updatesCallbacks: [], type: GlobalStoreObjectDataTypes.TREE_DATA})
const subscribableTreeLocationStoreSourceSingleton: ISubscribableTreeLocationStoreSource
    = new SubscribableTreeLocationStoreSource(
        {hashmap: {}, updatesCallbacks: [], type: GlobalStoreObjectDataTypes.TREE_LOCATION_DATA})
const subscribableTreeUserStoreSourceSingleton: ISubscribableTreeUserStoreSource
    = new SubscribableTreeUserStoreSource(
        {hashmap: {}, updatesCallbacks: [], type: GlobalStoreObjectDataTypes.TREE_LOCATION_DATA})
const subscribableContentStoreSourceSingleton: ISubscribableContentStoreSource
    = new SubscribableContentStoreSource(
        {hashmap: {}, updatesCallbacks: [], type: GlobalStoreObjectDataTypes.CONTENT_DATA})
const subscribableContentUserStoreSourceSingleton: ISubscribableContentUserStoreSource
    = new SubscribableContentUserStoreSource
({hashmap: {}, updatesCallbacks: [], type: GlobalStoreObjectDataTypes.CONTENT_USER_DATA})

export const treeStoreSourceSingletonModule
    = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
        .toConstantValue(subscribableTreeStoreSourceSingleton)
        .whenTargetTagged(TAGS.MAIN_APP, true)
})

export const stores =
    new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource)
        .toConstantValue(subscribableTreeLocationStoreSourceSingleton)
    bind<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
        .toConstantValue(subscribableTreeUserStoreSourceSingleton)
    bind<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
        .toConstantValue(subscribableContentStoreSourceSingleton)
    bind<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
        .toConstantValue(subscribableContentUserStoreSourceSingleton)

    bind<SubscribableGlobalStoreArgs>(TYPES.SubscribableGlobalStoreArgs).to(SubscribableGlobalStoreArgs)

    bind<MutableSubscribableGlobalStoreArgs>(TYPES.MutableSubscribableGlobalStoreArgs)
        .to(MutableSubscribableGlobalStoreArgs)

    bind<SubscribableContentUserStoreArgs>(TYPES.SubscribableContentUserStoreArgs)
        .to(SubscribableContentUserStoreArgs)
    bind<SubscribableContentStoreArgs>(TYPES.SubscribableContentStoreArgs).to(SubscribableContentStoreArgs)
    bind<SubscribableTreeStoreArgs>(TYPES.SubscribableTreeStoreArgs).to(SubscribableTreeStoreArgs)
    bind<SubscribableTreeUserStoreArgs>(TYPES.SubscribableTreeUserStoreArgs).to(SubscribableTreeUserStoreArgs)
    bind<SubscribableTreeLocationStoreArgs>(TYPES.SubscribableTreeLocationStoreArgs)
        .to(SubscribableTreeLocationStoreArgs)

    bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore).to(MutableSubscribableTreeStore)
        .whenTargetIsDefault()
    bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
        .to(MutableSubscribableTreeUserStore)
        .whenTargetIsDefault()
    bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
        .to(MutableSubscribableTreeLocationStore)
        .whenTargetIsDefault()
    bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
        .to(MutableSubscribableContentStore)
        .whenTargetIsDefault()
    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(MutableSubscribableContentUserStore)
        .whenTargetIsDefault()

    bind<SubscribableStoreSourceArgs>(TYPES.SubscribableStoreSourceArgs)
        .to(SubscribableStoreSourceArgs)

    bind<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore).to(SubscribableGlobalStore)

    bind<SubscribableContentStoreSourceArgs>(TYPES.SubscribableContentStoreSourceArgs)
        .to(SubscribableContentStoreSourceArgs)

    bind<SubscribableContentUserStoreSourceArgs>(TYPES.SubscribableContentUserStoreSourceArgs)
        .to(SubscribableContentUserStoreSourceArgs)
    bind<SubscribableTreeStoreSourceArgs>(TYPES.SubscribableTreeStoreSourceArgs)
        .to(SubscribableTreeStoreSourceArgs)
    bind<SubscribableTreeLocationStoreSourceArgs>(TYPES.SubscribableTreeLocationStoreSourceArgs)
        .to(SubscribableTreeLocationStoreSourceArgs)
    bind<SubscribableTreeUserStoreSourceArgs>(TYPES.SubscribableTreeUserStoreSourceArgs)
        .to(SubscribableTreeUserStoreSourceArgs)
// myContainer.bind<ISubscribableStore<ISubscribableTreeCore>>
// (TYPES.ISubscribableStore_ISubscribableTreeCore).to(SubscribableStore)
    /* ^^ TODO: Why can't i specify the interface on the SubscribableStore type? */
    bind<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore).to(SubscribableTreeStore)
    bind<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore).to(SubscribableTreeUserStore)
    bind<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore).to(SubscribableTreeLocationStore)
    bind<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore).to(SubscribableContentUserStore)
    bind<ISubscribableContentStore>(TYPES.ISubscribableContentStore).to(SubscribableContentStore)

    bind<GlobalStoreObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(GlobalStoreObjectDataTypes.TREE_DATA)
        .whenInjectedInto(SubscribableTreeStoreSourceArgs)
    bind<GlobalStoreObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(
        GlobalStoreObjectDataTypes.TREE_LOCATION_DATA)
        .whenInjectedInto(SubscribableTreeLocationStoreSourceArgs)
    bind<GlobalStoreObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(GlobalStoreObjectDataTypes.TREE_USER_DATA)
        .whenInjectedInto(SubscribableTreeUserStoreSourceArgs)
    bind<GlobalStoreObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(GlobalStoreObjectDataTypes.CONTENT_DATA)
        .whenInjectedInto(SubscribableContentStoreSourceArgs)
    bind<GlobalStoreObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(
        GlobalStoreObjectDataTypes.CONTENT_USER_DATA)
        .whenInjectedInto(SubscribableContentUserStoreSourceArgs)

    bind<ISyncableMutableSubscribableContentUser>(TYPES.ISyncableMutableSubscribableContentUser)
        .to(SyncableMutableSubscribableContentUser)
    bind<BranchesStoreArgs>(TYPES.BranchesStoreArgs).to(BranchesStoreArgs)

    // auto save stores
    bind<AutoSaveMutableSubscribableTreeStoreArgs>(TYPES.AutoSaveMutableSubscribableTreeStoreArgs)
        .to(AutoSaveMutableSubscribableTreeStoreArgs)

    bind<AutoSaveMutableSubscribableTreeUserStoreArgs>(TYPES.AutoSaveMutableSubscribableTreeUserStoreArgs)
        .to(AutoSaveMutableSubscribableTreeUserStoreArgs)

    bind<AutoSaveMutableSubscribableTreeLocationStoreArgs>
    (TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs)
        .to(AutoSaveMutableSubscribableTreeLocationStoreArgs)

    bind<AutoSaveMutableSubscribableContentStoreArgs>(TYPES.AutoSaveMutableSubscribableContentStoreArgs)
        .to(AutoSaveMutableSubscribableContentStoreArgs)

    bind<AutoSaveMutableSubscribableContentUserStoreArgs>
    (TYPES.AutoSaveMutableSubscribableContentUserStoreArgs)
        .to(AutoSaveMutableSubscribableContentUserStoreArgs)

    bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)
        .to(AutoSaveMutableSubscribableTreeStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
        .to(AutoSaveMutableSubscribableTreeLocationStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
        .to(AutoSaveMutableSubscribableTreeUserStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
        .to(AutoSaveMutableSubscribableContentStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(AutoSaveMutableSubscribableContentUserStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true)

    bind<OverdueListenerMutableSubscribableContentUserStoreArgs>(
        TYPES.OverdueListenerMutableSubscribableContentUserStoreArgs)
        .to(OverdueListenerMutableSubscribableContentUserStoreArgs)
    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(OverdueListenerMutableSubscribableContentUserStore)
        .whenTargetTagged(TAGS.OVERDUE_LISTENER, true)

})
//
const rendering = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<radian>(TYPES.radian).toConstantValue(0)
    bind<SigmaNodesUpdaterArgs>(TYPES.SigmaNodesUpdaterArgs).to(SigmaNodesUpdaterArgs)
    bind<CanvasUI>(TYPES.CanvasUI).to(CanvasUI)
    bind<CanvasUIArgs>(TYPES.CanvasUIArgs)
        .to(CanvasUIArgs)

    // TODO: fix these bindings for if we have multiple sigma instances.
    bind<ISigmaNodes>(TYPES.ISigmaNodes).toConstantValue({})
    bind<ISigmaEdges>(TYPES.ISigmaEdges).toConstantValue({})
    bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
    bind<ISigmaRenderManager>(TYPES.SigmaRenderManager).to(SigmaRenderManager)
        .whenTargetIsDefault()
    bind<SigmaRenderManagerArgs>(TYPES.SigmaRenderManagerArgs).to(SigmaRenderManagerArgs)
    bind<SigmaUpdaterArgs>(TYPES.SigmaUpdaterArgs).to(SigmaUpdaterArgs)

    bind<ISigma>(TYPES.ISigma).toConstantValue(sigmaInstance)

    bind<ISigmaUpdater>(TYPES.ISigmaUpdater).to(SigmaUpdater)

    bind<StoreSourceUpdateListenerArgs>(TYPES.StoreSourceUpdateListenerArgs).to(StoreSourceUpdateListenerArgs)
    bind<IStoreSourceUpdateListener>(TYPES.IStoreSourceUpdateListener).to(StoreSourceUpdateListener)

    bind<StoreSourceUpdateListenerCoreArgs>(TYPES.StoreSourceUpdateListenerCoreArgs)
        .to(StoreSourceUpdateListenerCoreArgs)
    bind<IStoreSourceUpdateListenerCore>(TYPES.IStoreSourceUpdateListenerCore).to(StoreSourceUpdateListenerCore)

    bind<IRenderManager>(TYPES.IRenderedNodesManager).to(RenderManager)
    bind<IRenderManagerCore>(TYPES.IRenderManagerCore).to(RenderManagerCore)
    bind<RenderManagerArgs>(TYPES.RenderedNodesManagerArgs).to(RenderManagerArgs)
    bind<RenderManagerCoreArgs>(TYPES.RenderedNodesManagerCoreArgs).to(RenderManagerCoreArgs)
    bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
    // bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager).to(SigmaRenderManager)
    bind<ISigmaNodesUpdater>(TYPES.ISigmaNodesUpdater).to(SigmaNodesUpdater)
        .whenTargetIsDefault()

    bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
    bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
        .whenTargetIsDefault()
    bind<TooltipRendererArgs>(TYPES.TooltipRendererArgs).to(TooltipRendererArgs)
    bind<ITooltipRenderer>(TYPES.ITooltipRenderer).to(TooltipRenderer)
    bind<TooltipOpenerArgs>(TYPES.TooltipOpenerArgs).to(TooltipOpenerArgs)
    bind<ITooltipOpener>(TYPES.ITooltipOpener).to(TooltipOpener)

    bind<ISigmaEdgesUpdater>(TYPES.ISigmaEdgesUpdater).to(SigmaEdgesUpdater)
    bind<SigmaEdgesUpdaterArgs>(TYPES.SigmaEdgesUpdaterArgs).to(SigmaEdgesUpdaterArgs)

    // bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).to(
    //
    // )
})
//
const dataObjects = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IDatedMutation<FieldMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
        data: {id: '12345'},
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    })
    bind<IDatedMutation<SetMutationTypes>>(TYPES.IDatedSetMutation).toConstantValue({
        data: '12345',
        timestamp: Date.now(),
        type: SetMutationTypes.ADD,
    })
    // ^^ really for unit tests only
    bind<IProppedDatedMutation<FieldMutationTypes, TreePropertyNames>>
    (TYPES.IProppedDatedMutation).toConstantValue({
        data: {id: TREE_ID3},
        propertyName: TreePropertyNames.PARENT_ID,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    })
    bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)

    bind<IMutableSubscribablePoint>(TYPES.IMutableSubscribablePoint).to(MutableSubscribablePoint)
    bind<MutableSubscribablePointArgs>(TYPES.MutableSubscribablePointArgs).to(MutableSubscribablePointArgs)

    bind<ISubscribableContent>(TYPES.ISubscribableContent).to(SubscribableContent)
    bind<ISubscribableContentUser>(TYPES.ISubscribableContentUser).to(SubscribableContentUser)
    bind<ISubscribableTree>(TYPES.ISubscribableTree).to(SubscribableTree)
    bind<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation).to(SubscribableTreeLocation)
    bind<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser).to(SubscribableTreeUser)
    bind<IMutableSubscribableField<boolean>>(TYPES.IMutableSubscribableBoolean).to(MutableSubscribableField)
    bind<MutableSubscribableFieldArgs>(TYPES.MutableSubscribableFieldArgs).to(MutableSubscribableFieldArgs)
    bind<SubscribableContentUserArgs>(TYPES.SubscribableContentUserArgs).to(SubscribableContentUserArgs)
    bind<IMutableSubscribableField<number>>(TYPES.IMutableSubscribableNumber).to(MutableSubscribableField)
    bind<IMutableSubscribableField<string>>(TYPES.IMutableSubscribableString).to(MutableSubscribableField)
    bind<IMutableSubscribableField<PROFICIENCIES>>(TYPES.IMutableSubscribableProficiency)
        .to(MutableSubscribableField)
    bind<IMutableSubscribableField<CONTENT_TYPES>>(TYPES.IMutableSubscribableContentType)
        .to(MutableSubscribableField)
    bind<IMutableSubscribableField<IProficiencyStats>>(TYPES.IMutableSubscribableProficiencyStats)
        .to(MutableSubscribableField)
    bind<IMutableSubscribableField<firebase.UserInfo>>(TYPES.IMutableSubscribableUserInfo)
        .to(MutableSubscribableField)
    bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
    bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
//
    bind<OneToManyMapArgs>(TYPES.OneToManyMapArgs).to(OneToManyMapArgs)
    bind<IOneToManyMap<string>>(TYPES.IOneToManyMap).to(OneToManyMap)
        .whenTargetIsDefault()
    // bind<IOneToManyMap<id>>(TYPES.IOneToManyMap).to(OneToManyMap)
    //     .whenTargetIsDefault()

    bind<SubscribableMutableStringSetArgs>
    (TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
    bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
    bind<SubscribableTreeArgs>(TYPES.SubscribableTreeArgs).to(SubscribableTreeArgs)
    bind<SubscribableTreeLocationArgs>(TYPES.SubscribableTreeLocationArgs).to(SubscribableTreeLocationArgs)

    bind<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree).to(MutableSubscribableTree)
    bind<IMutableSubscribableTreeLocation>(TYPES.IMutableSubscribableTreeLocation).to(MutableSubscribableTreeLocation)
    bind<IMutableSubscribableTreeUser>(TYPES.IMutableSubscribableTreeUser).to(MutableSubscribableTreeUser)
    bind<IMutableSubscribableContent>(TYPES.IMutableSubscribableContent).to(MutableSubscribableContent)
    bind<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser).to(MutableSubscribableContentUser)

    bind<ISyncableMutableSubscribableTree>(TYPES.ISyncableMutableSubscribableTree).to(SyncableMutableSubscribableTree)
    bind<ISyncableMutableSubscribableTreeLocation>(TYPES.ISyncableMutableSubscribableTreeLocation)
        .to(SyncableMutableSubscribableTreeLocation)
    bind<ISyncableMutableSubscribableTreeUser>(TYPES.ISyncableMutableSubscribableTreeUser)
        .to(SyncableMutableSubscribableTreeUser)
    bind<ISyncableMutableSubscribableContent>(TYPES.ISyncableMutableSubscribableContent)
        .to(SyncableMutableSubscribableContent)
    bind<ISyncableMutableSubscribableContentUser>(TYPES.ISyncableMutableSubscribableContentUser)
        .to(SyncableMutableSubscribableContentUser)

    bind<SubscribableTreeUserArgs>(TYPES.SubscribableTreeUserArgs).to(SubscribableTreeUserArgs)
    bind<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver).to(PropertyAutoFirebaseSaver)
    bind<SubscribableContentArgs>(TYPES.SubscribableContentArgs).to(SubscribableContentArgs)

    bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)

// tslint:disable-next-line ban-types
    bind<PropertyAutoFirebaseSaverArgs>(TYPES.PropertyAutoFirebaseSaverArgs).to(PropertyAutoFirebaseSaverArgs)
    bind<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
        .toConstantValue((updates: IDetailedUpdates) => void 0)
    bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types

    bind<PropertyFirebaseSaverArgs>(TYPES.PropertyFirebaseSaverArgs).to(PropertyFirebaseSaverArgs)
    bind<ITree>(TYPES.ITree).to(SubscribableTree)
// TODO: maybe only use this constant binding for a test container. . . Not production container

    bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)

    bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
})
export const components = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    // bind<TreeComponentCreatorArgs>(TYPES.TreeComponentCreatorArgs).to(TreeComponentCreatorArgs)
    // bind<ITreeComponentCreator>(TYPES.ITreeComponentCreator).to(TreeComponentCreator)
    // bind<ITree2ComponentCreator>(TYPES.ITree2ComponentCreator).to(Tree2ComponentCreator)
    // bind<Tree2ComponentCreatorArgs>(TYPES.Tree2ComponentCreatorArgs).to(Tree2ComponentCreatorArgs)

    bind<KnawledgeMapCreatorArgs>(TYPES.KnawledgeMapCreatorArgs).to(KnawledgeMapCreatorArgs)
    // bind<id>(TYPES.Id).toConstantValue(JOHN_USER_ID)
    //     .whenInjectedInto(KnawledgeMapCreatorArgs)
    const knawledgeMapCreatorMock = {
        create() {}
    }
    // bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).toConstantValue(knawledgeMapCreatorMock)
    // @injectable()
    // class KnawledgeMapCreator implements  IKnawledgeMapCreator {
    //     public create() {}
    // }
    // bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).to(KnawledgeMapCreator)
    bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).to(KnawledgeMapCreator)
    bind<TreeCreatorArgs>(TYPES.TreeCreatorArgs).to(TreeCreatorArgs)
    // bind<ITreeCreator>(TYPES.ITreeCreatorClone).to(TreeCreator)
    bind<ITreeCreator>(TYPES.ITreeCreator).to(TreeCreator)
    bind<INewTreeComponentCreator>(TYPES.INewTreeComponentCreator).to(NewTreeComponentCreator)
    bind<NewTreeComponentCreatorArgs>(TYPES.NewTreeComponentCreatorArgs).to(NewTreeComponentCreatorArgs)

})
// app

export const app = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IApp>(TYPES.IApp).to(App)
    bind<AppArgs>(TYPES.AppArgs).to(AppArgs)
    bind<AppContainer>(TYPES.AppContainer).to(AppContainer)
    bind<AppContainerArgs>(TYPES.AppContainerArgs).to(AppContainerArgs)
})

export const state: IState
 = {
    branchesMapsData: {},
    branchesMaps: {},
    branchesMapLoader: null,
    branchesMapUtils: null,
    centeredTreeId: GLOBAL_MAP_ROOT_TREE_ID,
    currentMapId: DEFAULT_MAP_ID,
    graphData: {
        nodes: [],
        edges: [],
    },
    graph: null,
    globalDataStore: null,
    globalDataStoreData: {
        content: {},
        contentUsers: {},
        trees: {},
        treeUsers: {},
        treeLocations: {},
    },
    renderer: null,
    sigmaInstance: null,
    sigmaNodeLoader: null,
    sigmaNodeLoaderCore: null,
    sigmaInitialized: false,
    uri: null,
    userLoader: null,
    usersData: {},
    users: {},
    // userId: JOHN_USER_ID,
    userId: null, // JOHN_USER_ID,
    userUtils: null,
    usersDataHashmapUpdated: .5242
};
export const misc = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<() => void>(TYPES.Function).toConstantValue(() => void 0)
    bind<any>(TYPES.Any).toConstantValue(null)
    bind<boolean>(TYPES.Boolean).toConstantValue(false)
    bind<string>(TYPES.String).toConstantValue('')
    bind<string>(TYPES.StringNotEmpty).toConstantValue('abc123')
    bind<any[]>(TYPES.Array).toDynamicValue((context: interfaces.Context) => [] )
        .whenTargetIsDefault()
// tslint:disable-next-line ban-types
    bind<id>(TYPES.Id).toConstantValue(JOHN_USER_ID)
    bind<Number>(TYPES.Number).toConstantValue(0)
    bind<object>(TYPES.Object).toDynamicValue((context: interfaces.Context) => ({}))
    bind<object>(TYPES.BranchesStoreState).toConstantValue(
        state
    )
    bind<IVueConfigurer>(TYPES.IVueConfigurer).to(VueConfigurer)
    bind<VueConfigurerArgs>(TYPES.VueConfigurerArgs).to(VueConfigurerArgs)

})

export const login = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<AuthListenerArgs>(TYPES.AuthListenerArgs).to(AuthListenerArgs)
    bind<IAuthListener>(TYPES.IAuthListener).to(AuthListener)
})

export const storeSingletons = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    bind<IMutableSubscribableGlobalStore>
    (TYPES.IMutableSubscribableGlobalStore)
        .to(MutableSubscribableGlobalStore)
        .inSingletonScope()
        .whenTargetIsDefault()
        // .toConstantValue(globalStoreSingleton)

    bind<BranchesStore>(TYPES.BranchesStore)
        .to(BranchesStore)
        .inSingletonScope()
        .whenTargetIsDefault()

    bind<GlobalDataStoreBranchesStoreSyncerArgs>(TYPES.GlobalDataStoreBranchesStoreSyncerArgs)
        .to(GlobalDataStoreBranchesStoreSyncerArgs)
    bind<IGlobalDataStoreBranchesStoreSyncer>(TYPES.IGlobalDataStoreBranchesStoreSyncer)
        .to(GlobalDataStoreBranchesStoreSyncer)

    // rendering singletons
    const contentIdSigmaIdMapSingletonArgs: OneToManyMapArgs = myContainer.get<OneToManyMapArgs>(TYPES.OneToManyMapArgs)

    const contentIdSigmaIdMapSingleton: IOneToManyMap<string> = new OneToManyMap(contentIdSigmaIdMapSingletonArgs)

    bind<IOneToManyMap<string>>(TYPES.IOneToManyMap).toConstantValue(contentIdSigmaIdMapSingleton)
        .whenTargetTagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)

    const contentIdSigmaIdMapSingletonGet
        = contentIdSigmaIdMapSingleton.get.bind(contentIdSigmaIdMapSingleton)
    bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(contentIdSigmaIdMapSingletonGet)
        .whenTargetTagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
    // contentIdSigmaIdMapSingletonGet['_id'] = Math.random()
    // log('the contentIdSigmaIdMapSingletonGet id from inversify.config is ', contentIdSigmaIdMapSingletonGet['_id'])

    bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        .to(SigmaRenderManager)
        .inSingletonScope()
        .whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true)

    bind<ISigmaNodesUpdater>(TYPES.ISigmaNodesUpdater)
        .to(SigmaNodesUpdater)
        .inSingletonScope()
        .whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true)

    const canvasUI: IUI = myContainer.get<CanvasUI>(TYPES.CanvasUI)
    bind<IUI[]>(TYPES.Array).toConstantValue([canvasUI])
        .whenTargetTagged(TAGS.DEFAULT_UIS_ARRAY, true)

})

export function myContainerLoadMockFirebaseReferences() {
    myContainer.load(mockFirebaseReferences)
}
export function myContainerLoadAllModules() {
    myContainer.load(firebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()
}
export function myContainerUnloadAllModules() {
    // myContainer.load(firebaseReferences)
    // myContainerLoadAllModulesExceptFirebaseRefs()

}
export function myContainerLoadAllModulesExceptTreeStoreSourceSingletonAndFirebaseRefs() {
    // myContainer.load(treeStoreSourceSingletonModule)
    myContainer.load(stores)
    // myContainer.load(firebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()
}

function myContainerLoadAllModulesExceptFirebaseRefsPart1() {
    myContainer.load(misc)
    myContainer.load(login)
    myContainer.load(treeStoreSourceSingletonModule)
    myContainer.load(stores)
}
function loadDataObjects() {
    myContainer.load(dataObjects)
}
function loadLoaders() {
    myContainer.load(loaders)
}
function loadRendering() {
    myContainer.load(rendering)
}
function loadStoreSingletons() {
    myContainer.load(storeSingletons)
}
function loadComponents() {
    myContainer.load(components)
}
function myContainerLoadAllModulesExceptFirebaseRefsPart2() {
    loadDataObjects()
    loadRendering()
    loadLoaders()
    loadStoreSingletons()
    loadComponents()
    myContainer.load(app)
}
export function myContainerLoadAllModulesExceptFirebaseRefs() {
    myContainerLoadAllModulesExceptFirebaseRefsPart1()
    // myContainer.load(firebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefsPart2()
}

export {myContainer}
