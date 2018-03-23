

const start = Date.now()
console.log('checkpoint 1.11', Date.now() - start)
import * as firebase_typings from './app/core/firebase_interfaces';
type Reference = firebase_typings.database.Reference;
console.log('checkpoint 1.111', Date.now() - start)
import {log} from './app/core/log';
console.log('checkpoint 1.112', Date.now() - start)
import {importSigma} from './other_imports/importSigma';
console.log('checkpoint 1.113', Date.now() - start)
import {Container, ContainerModule, injectable, interfaces} from 'inversify';
console.log('checkpoint 1.12', Date.now() - start)
import 'reflect-metadata';
console.log('checkpoint 1.121', Date.now() - start)
console.log('checkpoint 1.122', Date.now() - start)
import {App, AppArgs} from './app/core/app';
console.log('checkpoint 1.123', Date.now() - start)
import {FIREBASE_PATHS} from './app/loaders/paths';
console.log('checkpoint 1.124', Date.now() - start)
import {TreeLoader, TreeLoaderArgs} from './app/loaders/tree/TreeLoader';
console.log('checkpoint 1.125', Date.now() - start)
console.log('checkpoint 1.126', Date.now() - start)
import {SubscribableContent, SubscribableContentArgs} from './app/objects/content/SubscribableContent';
console.log('checkpoint 1.127', Date.now() - start)
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUser/ContentUserData';
console.log('checkpoint 1.13', Date.now() - start)
import {
    MutableSubscribableField,
    MutableSubscribableFieldArgs
} from './app/objects/field/MutableSubscribableField';
import firebaseDevConfig = require('./app/objects/firebase.dev.config.json');
// import firebase from './app/objects/firebaseService.js'
console.log('checkpoint 1.14', Date.now() - start)
import {
    FieldMutationTypes, IColorSlice, IContentLoader, IContentUserData, IDatabaseAutoSaver, IDetailedUpdates,
    IMutableStringSet, IMutableSubscribableContent, IMutableSubscribableContentUser,
    INewTreeComponentCreator, IOneToManyMap,
    IProficiencyStats,
    IProppedDatedMutation,
    // ITree2ComponentCreator,
    ISaveUpdatesToDBFunction, ISigma,
    ISigmaNode, ISubscribableContentUser,
    IMutableSubscribableField, IMutableSubscribableStringSet, ISyncable, ISyncableMutableSubscribableContentUser,
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
    IBranchesMapLoaderCore, IBranchesMapUtils, ISigmaFactory, ITreeLocationData, FGetStore, fImportSigma,
} from './app/objects/interfaces';
console.log('checkpoint 1.15', Date.now() - start)
import {
    IApp,
    IDatedMutation, IDBSubscriberToTree, IDBSubscriberToTreeLocation, IMutableSubscribablePoint,
    IStoreSourceUpdateListenerCore,
    ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource, ISubscribableTreeLocation, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource,
    ISubscribableTreeUserStoreSource, ISyncableMutableSubscribableTreeUser, ITreeLoader, ITreeLocationLoader,
    CustomStoreDataTypes
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
    MutableSubscribableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/MutableSubscribableStringSet';
import {
    CanvasUI,
    CanvasUIArgs
} from './app/objects/sigmaNode/CanvasUI';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {RenderManager, RenderManagerArgs} from './app/objects/sigmaNode/RenderManager';
import {RenderManagerCore, RenderManagerCoreArgs} from './app/objects/sigmaNode/RenderManagerCore';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
console.log('checkpoint 1.16', Date.now() - start)
// import {DBSubscriberToTree, DBSubscriberToTreeArgs} from './app/objects/tree/DBSubscriberToTree';
// import {
//     DBSubscriberToTreeLocation,
//     DBSubscriberToTreeLocationArgs
// } from './app/objects/treeLocation/DBSubscriberToTreeLocation';
import {TYPES } from './app/objects/types';
import {UIColor} from './app/objects/uiColor';
import { TREE_ID3} from './app/testHelpers/testHelpers';
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
console.log('checkpoint 1.17', Date.now() - start)
import {DEFAULT_MAP_ID, GRAPH_CONTAINER_ID, JOHN_USER_ID, GLOBAL_MAP_ROOT_TREE_ID} from './app/core/globals';

import {TAGS} from './app/objects/tags';

console.log('checkpoint 1.18', Date.now() - start)
const Vue = require('vue').default || require('vue')
const Vuex = require('vuex').default || require('vuex')
console.log('checkpoint 1.19', Date.now() - start)
console.log('checkpoint 1.1901', Date.now() - start)
import {SigmaNodeLoader, SigmaNodeLoaderArgs} from './app/loaders/sigmaNode/sigmaNodeLoader';
console.log('checkpoint 1.1902', Date.now() - start)
import {SigmaNodeLoaderCore, SigmaNodeLoaderCoreArgs} from './app/loaders/sigmaNode/sigmaNodeLoaderCore';
console.log('checkpoint 1.1903', Date.now() - start)
import {FamilyLoaderCore, FamilyLoaderCoreArgs} from './app/loaders/sigmaNode/familyLoaderCore';
console.log('checkpoint 1.1904', Date.now() - start)
import {FamilyLoader, FamilyLoaderArgs} from './app/loaders/sigmaNode/familyLoader';
console.log('checkpoint 1.1905', Date.now() - start)
import {SigmaEdgesUpdater, SigmaEdgesUpdaterArgs} from './app/objects/sigmaEdge/sigmaEdgesUpdater';
console.log('checkpoint 1.1906', Date.now() - start)
import {UserLoader, UserLoaderArgs} from './app/loaders/user/UserLoader';
console.log('checkpoint 1.1907', Date.now() - start)
import {UserUtils, UserUtilsArgs} from './app/objects/user/usersUtils';
console.log('checkpoint 1.1908', Date.now() - start)
import {UserLoaderAndAutoSaver, UserLoaderAndAutoSaverArgs} from './app/loaders/user/UserLoaderAndAutoSaver';
console.log('checkpoint 1.1909', Date.now() - start)
console.log('checkpoint 1.19091', Date.now() - start)
console.log('checkpoint 1.19092', Date.now() - start)
import {
    OverdueListenerMutableSubscribableContentUserStore,
    OverdueListenerMutableSubscribableContentUserStoreArgs
} from './app/objects/stores/contentUser/OverdueListenerMutableSubscribableContentUserStore';
console.log('checkpoint 1.19093', Date.now() - start)
import {
    GlobalDataStoreBranchesStoreSyncer,
    GlobalDataStoreBranchesStoreSyncerArgs
} from './app/core/globalDataStoreBranchesStoreSyncer';
console.log('checkpoint 1.19094', Date.now() - start)
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from './app/components/knawledgeMap/KnawledgeMap';
console.log('checkpoint 1.19095', Date.now() - start)
import {BranchesMapLoader, BranchesMapLoaderArgs} from './app/loaders/branchesMap/BranchesMapLoader';
console.log('checkpoint 1.19096', Date.now() - start)
import {BranchesMapLoaderCoreArgs, BranchesMapLoaderCore} from './app/loaders/branchesMap/BranchesMapLoaderCore';
console.log('checkpoint 1.19097', Date.now() - start)
import {BranchesMapUtils, BranchesMapUtilsArgs} from './app/objects/branchesMap/branchesMapUtils';
console.log('checkpoint 1.19098', Date.now() - start)
console.log('checkpoint 1.19099', Date.now() - start)
import SigmaFactory, {SigmaFactoryArgs} from './other_imports/sigma/sigma.factory';
console.log('checkpoint 1.190991', Date.now() - start)
import {MockSigmaFactory} from './app/testHelpers/MockSigma';
console.log('checkpoint 1.190992', Date.now() - start)
import {INTERACTION_MODES} from './app/core/store/interactionModes';
console.log('checkpoint 1.190993', Date.now() - start)
import {sampleTreeLocationData1} from './app/objects/treeLocation/treeLocationTestHelpers';
console.log('checkpoint 1.190994', Date.now() - start)
import {Store} from 'vuex';
console.log('checkpoint 1.190995', Date.now() - start)

console.log('checkpoint 1.191', Date.now() - start)
Vue.use(Vuex);
console.log('checkpoint 1.192', Date.now() - start)

const firebaseConfig = firebaseDevConfig;
const myContainer = new Container();

console.log('checkpoint 1.193', Date.now() - start)
console.log('checkpoint 1.194', Date.now() - start)

export const firebaseReferences = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const firebase = require('firebase').default || require('firebase');
    // import * as firebase from 'firebase';
    firebase.initializeApp(firebaseConfig);
    const treesRef = firebase.database().ref(FIREBASE_PATHS.TREES);
    const treeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS);
    const treeUsersRef = firebase.database().ref(FIREBASE_PATHS.TREE_USERS);
    const contentRef = firebase.database().ref(FIREBASE_PATHS.CONTENT);
    const contentUsersRef = firebase.database().ref(FIREBASE_PATHS.CONTENT_USERS);
    const usersRef = firebase.database().ref(FIREBASE_PATHS.USERS);
    const branchesMapsRef = firebase.database().ref(FIREBASE_PATHS.BRANCHES_MAPS);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treesRef)
        .whenTargetTagged(TAGS.TREES_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeLocationsRef)
        .whenTargetTagged(TAGS.TREE_LOCATIONS_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeUsersRef)
        .whenTargetTagged(TAGS.TREE_USERS_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentRef)
        .whenTargetTagged(TAGS.CONTENT_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentUsersRef)
        .whenTargetTagged(TAGS.CONTENT_USERS_REF, true);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(usersRef)
        .whenTargetTagged(TAGS.USERS_REF, true);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(branchesMapsRef)
        .whenTargetTagged(TAGS.BRANCHES_MAPS_REF, true);
});
export function getMockRef(path: FIREBASE_PATHS) {
    const MockFirebase = require('firebase-mock').MockFirebase;
    return new MockFirebase(path)
}
export const mockFirebaseReferences = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const mockTreesRef = getMockRef(FIREBASE_PATHS.TREES);
    const mockTreeLocationsRef = getMockRef(FIREBASE_PATHS.TREE_LOCATIONS);
    const mockTreeUsersRef = getMockRef(FIREBASE_PATHS.TREE_USERS);
    const mockContentRef = getMockRef(FIREBASE_PATHS.CONTENT);
    const mockContentUsersRef = getMockRef(FIREBASE_PATHS.CONTENT_USERS);
    const mockBranchesMapsRef = getMockRef(FIREBASE_PATHS.BRANCHES_MAPS);
    const mockUsersRef = getMockRef(FIREBASE_PATHS.USERS);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenTargetTagged(TAGS.TREES_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenTargetTagged(TAGS.TREE_LOCATIONS_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenTargetTagged(TAGS.TREE_USERS_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenTargetTagged(TAGS.CONTENT_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenTargetTagged(TAGS.CONTENT_USERS_REF, true);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockUsersRef)
        .whenTargetTagged(TAGS.USERS_REF, true);

    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockBranchesMapsRef)
        .whenTargetTagged(TAGS.BRANCHES_MAPS_REF, true);
});
export const loaders = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    const {SpecialTreeLoader, SpecialTreeLoaderArgs} = require('./app/loaders/tree/specialTreeLoader');
    const {TreeLoaderAndAutoSaver, TreeLoaderAndAutoSaverArgs} = require('./app/loaders/tree/TreeLoaderAndAutoSaver');

    //treeLoader
    myContainer.bind(TYPES.TreeLoaderAndAutoSaverArgs).to(TreeLoaderAndAutoSaverArgs);

    myContainer.bind<TreeLoaderArgs>(TYPES.TreeLoaderArgs).to(TreeLoaderArgs);
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)
        .whenTargetIsDefault();
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(SpecialTreeLoader)
        .whenTargetTagged(TAGS.SPECIAL_TREE_LOADER, true);
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    myContainer.bind(TYPES.SpecialTreeLoaderArgs)
        .to(SpecialTreeLoaderArgs);


    // contentLoader
    const {ContentLoader, ContentLoaderArgs} = require('./app/loaders/content/ContentLoader');
    const {
        ContentLoaderAndAutoSaverArgs,
        ContentLoaderAndAutoSaver
    } = require('./app/loaders/content/ContentLoaderAndAutoSaver');
    myContainer.bind<IContentLoader>(TYPES.IContentLoader).to(ContentLoader)
        .whenTargetIsDefault();
    myContainer.bind<IContentLoader>(TYPES.IContentLoader).to(ContentLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    myContainer.bind(TYPES.ContentLoaderAndAutoSaverArgs)
        .to(ContentLoaderAndAutoSaverArgs);
    myContainer.bind(TYPES.ContentLoaderArgs).to(ContentLoaderArgs);

    const {ContentUserLoader, ContentUserLoaderArgs} = require('./app/loaders/contentUser/ContentUserLoader');
    const {
        ContentUserLoaderAndAutoSaver,
        ContentUserLoaderAndAutoSaverArgs
    } = require('./app/loaders/contentUser/ContentUserLoaderAndAutoSaver');
    const {
        ContentUserLoaderAndOverdueListener,
        ContentUserLoaderAndOverdueListenerArgs
    } = require('./app/loaders/contentUser/ContentUserLoaderAndOverdueListener');

    myContainer.bind(TYPES.ContentUserLoaderArgs).to(ContentUserLoaderArgs);
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoader)
        .whenTargetIsDefault();
    myContainer.bind(TYPES.ContentUserLoaderAndAutoSaverArgs)
        .to(ContentUserLoaderAndAutoSaverArgs);
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);
    myContainer.bind(TYPES.ContentUserLoaderAndOverdueListenerArgs)
        .to(ContentUserLoaderAndOverdueListenerArgs);
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoaderAndOverdueListener)
        .whenTargetTagged(TAGS.OVERDUE_LISTENER, true);


    const {TreeUserLoader, TreeUserLoaderArgs} = require('./app/loaders/treeUser/TreeUserLoader');
    myContainer.bind<ITreeUserLoader>(TYPES.ITreeUserLoader).to(TreeUserLoader);
    myContainer.bind(TYPES.TreeUserLoaderArgs).to(TreeUserLoaderArgs);

    myContainer.bind<UserLoaderArgs>(TYPES.UserLoaderArgs).to(UserLoaderArgs);
    myContainer.bind<IUserLoader>(TYPES.IUserLoader).to(UserLoader)
        .whenTargetIsDefault();
    myContainer.bind<UserLoaderAndAutoSaverArgs>(TYPES.UserLoaderAndAutoSaverArgs)
        .to(UserLoaderAndAutoSaverArgs);
    myContainer.bind<IUserLoader>(TYPES.IUserLoader)
        .to(UserLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);
    myContainer.bind<UserUtilsArgs>(TYPES.UserUtilsArgs).to(UserUtilsArgs);
    myContainer.bind<IUserUtils>(TYPES.IUserUtils).to(UserUtils);

    // loaders

    myContainer.bind<BranchesMapLoaderArgs>(TYPES.BranchesMapLoaderArgs).to(BranchesMapLoaderArgs);
    myContainer.bind<IBranchesMapLoader>(TYPES.IBranchesMapLoader).to(BranchesMapLoader);
    myContainer.bind<BranchesMapLoaderCoreArgs>(TYPES.BranchesMapLoaderCoreArgs).to(BranchesMapLoaderCoreArgs);
    myContainer.bind<IBranchesMapLoaderCore>(TYPES.IBranchesMapLoaderCore).to(BranchesMapLoaderCore);

    myContainer.bind<BranchesMapUtilsArgs>(TYPES.BranchesMapUtilsArgs).to(BranchesMapUtilsArgs);
    myContainer.bind<IBranchesMapUtils>(TYPES.IBranchesMapUtils).to(BranchesMapUtils);

    // loader auto savers

    const {TreeLocationLoader, TreeLocationLoaderArgs} = require('./app/loaders/treeLocation/TreeLocationLoader');
    const {
        TreeLocationLoaderAndAutoSaver,
        TreeLocationLoaderAndAutoSaverArgs
    } = require('./app/loaders/treeLocation/TreeLocationLoaderAndAutoSaver');
    myContainer.bind(TYPES.TreeLocationLoaderAndAutoSaverArgs)
        .to(TreeLocationLoaderAndAutoSaverArgs);

    myContainer.bind<ITreeLocationLoader>(TYPES.ITreeLocationLoader).to(TreeLocationLoader)
        .whenTargetIsDefault();
    myContainer.bind<ITreeLocationLoader>(TYPES.ITreeLocationLoader).to(TreeLocationLoaderAndAutoSaver)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);
    myContainer.bind(TYPES.TreeLocationLoaderArgs).to(TreeLocationLoaderArgs);

    myContainer.bind<SigmaNodeLoaderCoreArgs>(TYPES.SigmaNodeLoaderCoreArgs).to(SigmaNodeLoaderCoreArgs);
    myContainer.bind<ISigmaNodeLoaderCore>(TYPES.ISigmaNodeLoaderCore).to(SigmaNodeLoaderCore)
        .inSingletonScope()
        .whenTargetIsDefault();
    myContainer.bind<SigmaNodeLoaderArgs>(TYPES.SigmaNodeLoaderArgs).to(SigmaNodeLoaderArgs);
    myContainer.bind<ISigmaNodeLoader>(TYPES.ISigmaNodeLoader).to(SigmaNodeLoader)
        .inSingletonScope()
        .whenTargetIsDefault();

    myContainer.bind<IFamilyLoader>(TYPES.IFamilyLoader).to(FamilyLoader);
    myContainer.bind<FamilyLoaderArgs>(TYPES.FamilyLoaderArgs).to(FamilyLoaderArgs);
    myContainer.bind<IFamilyLoaderCore>(TYPES.IFamilyLoaderCore).to(FamilyLoaderCore);
    myContainer.bind<FamilyLoaderCoreArgs>(TYPES.FamilyLoaderCoreArgs).to(FamilyLoaderCoreArgs);

});

export const treeStoreSourceSingletonModule
    = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {


});

export const stores =
    new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const {
        AutoSaveMutableSubscribableContentUserStore,
        AutoSaveMutableSubscribableContentUserStoreArgs
    } = require('./app/objects/stores/contentUser/AutoSaveMutableSubscribableContentUserStore');


    const {SubscribableGlobalStore, SubscribableGlobalStoreArgs}
    = require('./app/objects/stores/SubscribableGlobalStore');
    bind(TYPES.SubscribableGlobalStoreArgs).to(SubscribableGlobalStoreArgs);
    bind<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore).to(SubscribableGlobalStore);

    const {
        SubscribableContentStore,
        SubscribableContentStoreArgs,
    } = require('./app/objects/stores/content/SubscribableContentStore');
    bind(TYPES.SubscribableContentStoreArgs).to(SubscribableContentStoreArgs);

    const {SubscribableTreeStore, SubscribableTreeStoreArgs} =
        require('./app/objects/stores/tree/SubscribableTreeStore');
    bind<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore).to(SubscribableTreeStore);

    bind(TYPES.SubscribableTreeStoreArgs).to(SubscribableTreeStoreArgs);


    const {
            SubscribableTreeUserStore,
            SubscribableTreeUserStoreArgs
        } = require('./app/objects/stores/treeUser/SubscribableTreeUserStore');
    bind(TYPES.SubscribableTreeUserStoreArgs).to(SubscribableTreeUserStoreArgs);

    const {
        SubscribableTreeLocationStore,
        SubscribableTreeLocationStoreArgs
    } = require('./app/objects/stores/treeLocation/SubscribableTreeLocationStore');

    bind<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore).to(SubscribableTreeLocationStore);

    bind(TYPES.SubscribableTreeLocationStoreArgs)
        .to(SubscribableTreeLocationStoreArgs);

    const {MutableSubscribableTreeStore} = require('./app/objects/stores/tree/MutableSubscribableTreeStore');
    bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore).to(MutableSubscribableTreeStore)
        .whenTargetIsDefault();

    const {MutableSubscribableTreeUserStore}
    = require('./app/objects/stores/treeUser/MutableSubscribableTreeUserStore');
    bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
        .to(MutableSubscribableTreeUserStore)
        .whenTargetIsDefault();

    const {
            MutableSubscribableTreeLocationStore
    } = require('./app/objects/stores/treeLocation/MutableSubscribableTreeLocationStore');
    bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
        .to(MutableSubscribableTreeLocationStore)
        .whenTargetIsDefault();

    const {MutableSubscribableContentStore} = require('./app/objects/stores/content/MutableSubscribableContentStore');
    const {
        AutoSaveMutableSubscribableContentStore,
        AutoSaveMutableSubscribableContentStoreArgs
        } = require('./app/objects/stores/content/AutoSaveMutableSubscribableContentStore');

    bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
        .to(MutableSubscribableContentStore)
        .whenTargetIsDefault();

    bind(TYPES.AutoSaveMutableSubscribableContentStoreArgs)
            .to(AutoSaveMutableSubscribableContentStoreArgs);

    const {
        MutableSubscribableContentUserStore
    } = require('./app/objects/stores/contentUser/MutableSubscribableContentUserStore');
    const {
        SubscribableContentUserStore,
        SubscribableContentUserStoreArgs
    } = require('./app/objects/stores/contentUser/SubscribableContentUserStore');

    bind(TYPES.SubscribableContentUserStoreArgs)
            .to(SubscribableContentUserStoreArgs);

    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(MutableSubscribableContentUserStore)
        .whenTargetIsDefault();

    const {
        SubscribableContentStoreSource, SubscribableContentStoreSourceArgs,
        SubscribableContentUserStoreSource, SubscribableContentUserStoreSourceArgs,
        SubscribableStoreSourceArgs, SubscribableTreeLocationStoreSource,
        SubscribableTreeLocationStoreSourceArgs,
        SubscribableTreeStoreSource,
        SubscribableTreeStoreSourceArgs, SubscribableTreeUserStoreSource, SubscribableTreeUserStoreSourceArgs
    } = require('./app/objects/stores/SubscribableStoreSource');

    bind(TYPES.SubscribableTreeStoreSourceArgs)
        .to(SubscribableTreeStoreSourceArgs)
    bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
        .to(SubscribableTreeStoreSource)
        .inSingletonScope()

    bind(TYPES.SubscribableTreeLocationStoreSourceArgs)
        .to(SubscribableTreeLocationStoreSourceArgs)
    bind<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource)
        .to(SubscribableTreeLocationStoreSource)
        .inSingletonScope()

    bind(TYPES.SubscribableTreeUserStoreSourceArgs)
        .to(SubscribableTreeUserStoreSourceArgs)
    bind<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
        .to(SubscribableTreeUserStoreSource)
        .inSingletonScope()

    bind(TYPES.SubscribableContentStoreSourceArgs)
        .to(SubscribableContentStoreSourceArgs)
    bind(TYPES.ISubscribableContentStoreSource)
        .to(SubscribableContentStoreSource)
        .inSingletonScope()

    bind(TYPES.SubscribableContentUserStoreSourceArgs)
        .to(SubscribableContentUserStoreSourceArgs)
    bind<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
        .to(SubscribableContentUserStoreSource)
        .inSingletonScope()

    bind(TYPES.SubscribableStoreSourceArgs)
        .to(SubscribableStoreSourceArgs);

// myContainer.bind<ISubscribableStore<ISubscribableTreeCore>>
// (TYPES.ISubscribableStore_ISubscribableTreeCore).to(SubscribableStore)
    /* ^^ TODO: Why can't i specify the interface on the SubscribableStore type? */


    bind<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore).to(SubscribableTreeUserStore);


    bind<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore).to(SubscribableContentUserStore);
    bind<ISubscribableContentStore>(TYPES.ISubscribableContentStore).to(SubscribableContentStore);

    bind<CustomStoreDataTypes>(TYPES.ObjectDataTypes).toConstantValue(CustomStoreDataTypes.TREE_DATA)
        .whenTargetTagged(TAGS.TREE_DATA, true)
    bind<CustomStoreDataTypes>(TYPES.ObjectDataTypes).toConstantValue(
        CustomStoreDataTypes.TREE_LOCATION_DATA)
        .whenTargetTagged(TAGS.TREE_LOCATIONS_DATA, true)
    bind<CustomStoreDataTypes>(TYPES.ObjectDataTypes).toConstantValue(CustomStoreDataTypes.TREE_USER_DATA)
        .whenTargetTagged(TAGS.TREE_USERS_DATA, true)
    bind<CustomStoreDataTypes>(TYPES.ObjectDataTypes).toConstantValue(CustomStoreDataTypes.CONTENT_DATA)
        .whenTargetTagged(TAGS.CONTENT_DATA, true)
    bind<CustomStoreDataTypes>(TYPES.ObjectDataTypes).toConstantValue(
        CustomStoreDataTypes.CONTENT_USER_DATA)
        .whenTargetTagged(TAGS.CONTENT_USERS_DATA, true)

    const {SyncableMutableSubscribableContentUser}
            = require('./app/objects/contentUser/SyncableMutableSubscribableContentUser');
    bind<ISyncableMutableSubscribableContentUser>(TYPES.ISyncableMutableSubscribableContentUser)
        .to(SyncableMutableSubscribableContentUser);

    const {BranchesStoreArgs} = require('./app/core/store/store');
    bind(TYPES.BranchesStoreArgs).to(BranchesStoreArgs);

    bind
    (TYPES.AutoSaveMutableSubscribableContentUserStoreArgs)
            .to(AutoSaveMutableSubscribableContentUserStoreArgs);

    const {
        AutoSaveMutableSubscribableTreeStore,
        AutoSaveMutableSubscribableTreeStoreArgs
    } = require('./app/objects/stores/tree/AutoSaveMutableSubscribableTreeStore');

    // auto save stores
    bind(TYPES.AutoSaveMutableSubscribableTreeStoreArgs)
        .to(AutoSaveMutableSubscribableTreeStoreArgs);

    const {
        AutoSaveMutableSubscribableTreeUserStore,
        AutoSaveMutableSubscribableTreeUserStoreArgs
    } = require('./app/objects/stores/treeUser/AutoSaveMutableSubscribableTreeUserStore');
    bind(TYPES.AutoSaveMutableSubscribableTreeUserStoreArgs)
        .to(AutoSaveMutableSubscribableTreeUserStoreArgs);

    bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
            .to(AutoSaveMutableSubscribableTreeUserStore)
            .whenTargetTagged(TAGS.AUTO_SAVER, true);

    const {
        AutoSaveMutableSubscribableTreeLocationStore,
        AutoSaveMutableSubscribableTreeLocationStoreArgs
    } = require('./app/objects/stores/treeLocation/AutoSaveMutableSubscribableTreeLocationStore');

    bind
    (TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs)
        .to(AutoSaveMutableSubscribableTreeLocationStoreArgs);

    bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
        .to(AutoSaveMutableSubscribableTreeLocationStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)
        .to(AutoSaveMutableSubscribableTreeStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
        .to(AutoSaveMutableSubscribableContentStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(AutoSaveMutableSubscribableContentUserStore)
        .whenTargetTagged(TAGS.AUTO_SAVER, true);

    bind<OverdueListenerMutableSubscribableContentUserStoreArgs>(
        TYPES.OverdueListenerMutableSubscribableContentUserStoreArgs)
        .to(OverdueListenerMutableSubscribableContentUserStoreArgs);
    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(OverdueListenerMutableSubscribableContentUserStore)
        .whenTargetTagged(TAGS.OVERDUE_LISTENER, true);

    bind<FGetStore>(TYPES.fGetStore).toConstantValue(() => { return {} as Store<any>})
        // ^^ This will get overriden in the BranchesStore constructor
});
//
const rendering = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<radian>(TYPES.radian).toConstantValue(0);

    bind<CanvasUI>(TYPES.CanvasUI).to(CanvasUI);
    bind<CanvasUIArgs>(TYPES.CanvasUIArgs)
        .to(CanvasUIArgs);

    // TODO: fix these bindings for if we have multiple sigma instances.
    bind<ISigmaNodes>(TYPES.ISigmaNodes).toConstantValue({});
    bind<ISigmaEdges>(TYPES.ISigmaEdges).toConstantValue({});
    bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs);

    const {SigmaRenderManager, SigmaRenderManagerArgs} = require('./app/objects/sigmaNode/SigmaRenderManager');
    bind<ISigmaRenderManager>(TYPES.SigmaRenderManager).to(SigmaRenderManager)
        .whenTargetIsDefault();
    bind(TYPES.SigmaRenderManagerArgs).to(SigmaRenderManagerArgs);

    const {SigmaUpdaterArgs, SigmaUpdater} = require('./app/objects/sigmaUpdater/sigmaUpdater');
    bind(TYPES.SigmaUpdaterArgs).to(SigmaUpdaterArgs);

    // bind<ISigma>(TYPES.ISigma).toConstantValue(sigmaInstance) // << TODO: I think this is only used in unit tests

    bind<ISigmaUpdater>(TYPES.ISigmaUpdater).to(SigmaUpdater);




    const {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} = require('./app/objects/stores/StoreSourceUpdateListener');
    const {
        StoreSourceUpdateListenerCore,
        StoreSourceUpdateListenerCoreArgs
    } = require('./app/objects/stores/StoreSourceUpdateListenerCore');
    bind(TYPES.StoreSourceUpdateListenerArgs).to(StoreSourceUpdateListenerArgs);
    bind<IStoreSourceUpdateListener>(TYPES.IStoreSourceUpdateListener).to(StoreSourceUpdateListener);

    bind(TYPES.StoreSourceUpdateListenerCoreArgs)
        .to(StoreSourceUpdateListenerCoreArgs);
    bind<IStoreSourceUpdateListenerCore>(TYPES.IStoreSourceUpdateListenerCore).to(StoreSourceUpdateListenerCore);

    bind<IRenderManager>(TYPES.IRenderedNodesManager).to(RenderManager);
    bind<IRenderManagerCore>(TYPES.IRenderManagerCore).to(RenderManagerCore);
    bind<RenderManagerArgs>(TYPES.RenderedNodesManagerArgs).to(RenderManagerArgs);
    bind<RenderManagerCoreArgs>(TYPES.RenderedNodesManagerCoreArgs).to(RenderManagerCoreArgs);
    bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode);
    // bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager).to(SigmaRenderManager)

    bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice);
    bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
        .whenTargetIsDefault();

    const {TooltipRenderer, TooltipRendererArgs} = require('./app/objects/tooltipOpener/tooltipRenderer');
    const {TooltipOpener, TooltipOpenerArgs} = require('./app/objects/tooltipOpener/tooltipOpener');
    bind(TYPES.TooltipRendererArgs).to(TooltipRendererArgs);
    bind<ITooltipRenderer>(TYPES.ITooltipRenderer).to(TooltipRenderer);
    bind(TYPES.TooltipOpenerArgs).to(TooltipOpenerArgs);
    bind<ITooltipOpener>(TYPES.ITooltipOpener).to(TooltipOpener);

    bind<ISigmaEdgesUpdater>(TYPES.ISigmaEdgesUpdater)
        .to(SigmaEdgesUpdater)
        .inSingletonScope()
        .whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);
    bind<SigmaEdgesUpdaterArgs>(TYPES.SigmaEdgesUpdaterArgs).to(SigmaEdgesUpdaterArgs);

    bind<fImportSigma>(TYPES.fImportSigma).toConstantValue(importSigma)

    // bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).to(
    //
    // )
});
const sigma = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<SigmaFactoryArgs>(TYPES.SigmaFactoryArgs).to(SigmaFactoryArgs);
    bind<ISigmaFactory>(TYPES.ISigmaFactory).to(SigmaFactory);
});
const mockSigma = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ISigmaFactory>(TYPES.ISigmaFactory).to(MockSigmaFactory);
});
//
const dataObjects = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IDatedMutation<FieldMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
        data: {id: '12345'},
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    });
    bind<IDatedMutation<SetMutationTypes>>(TYPES.IDatedSetMutation).toConstantValue({
        data: '12345',
        timestamp: Date.now(),
        type: SetMutationTypes.ADD,
    });
    // ^^ really for unit tests only
    bind<IProppedDatedMutation<FieldMutationTypes, TreePropertyNames>>
    (TYPES.IProppedDatedMutation).toConstantValue({
        data: {id: TREE_ID3},
        propertyName: TreePropertyNames.PARENT_ID,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    });
    bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs);
    bind<ITreeLocationData>(TYPES.ITreeLocationData).toConstantValue(sampleTreeLocationData1);

    bind<IMutableSubscribablePoint>(TYPES.IMutableSubscribablePoint).to(MutableSubscribablePoint);
    bind<MutableSubscribablePointArgs>(TYPES.MutableSubscribablePointArgs).to(MutableSubscribablePointArgs);

    bind<ISubscribableContent>(TYPES.ISubscribableContent).to(SubscribableContent);

    const {
        SubscribableContentUser,
        SubscribableContentUserArgs
    } = require('./app/objects/contentUser/SubscribableContentUser');
    bind<ISubscribableContentUser>(TYPES.ISubscribableContentUser).to(SubscribableContentUser);
    bind(TYPES.SubscribableContentUserArgs).to(SubscribableContentUserArgs);

    const {
        SubscribableTreeLocation,
        SubscribableTreeLocationArgs
    } = require('./app/objects/treeLocation/SubscribableTreeLocation');
    bind(TYPES.SubscribableTreeLocationArgs).to(SubscribableTreeLocationArgs);
    bind<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation).to(SubscribableTreeLocation);
    bind<IMutableSubscribableField<boolean>>(TYPES.IMutableSubscribableBoolean).to(MutableSubscribableField);
    bind<MutableSubscribableFieldArgs>(TYPES.MutableSubscribableFieldArgs).to(MutableSubscribableFieldArgs);
    bind<IMutableSubscribableField<number>>(TYPES.IMutableSubscribableNumber).to(MutableSubscribableField);
    bind<IMutableSubscribableField<string>>(TYPES.IMutableSubscribableString).to(MutableSubscribableField);
    bind<IMutableSubscribableField<PROFICIENCIES>>(TYPES.IMutableSubscribableProficiency)
        .to(MutableSubscribableField);
    bind<IMutableSubscribableField<CONTENT_TYPES>>(TYPES.IMutableSubscribableContentType)
        .to(MutableSubscribableField);
    bind<IMutableSubscribableField<IProficiencyStats>>(TYPES.IMutableSubscribableProficiencyStats)
        .to(MutableSubscribableField);
    bind<IMutableSubscribableField<firebase_typings.UserInfo>>(TYPES.IMutableSubscribableUserInfo)
        .to(MutableSubscribableField);
    bind<IMutableSubscribableStringSet>(TYPES.ISubscribableMutableStringSet).to(MutableSubscribableStringSet);
    bind<IMutableStringSet>(TYPES.IMutableStringSet).to(MutableSubscribableStringSet);
//

    const {OneToManyMap, OneToManyMapArgs} = require('./app/objects/oneToManyMap/oneToManyMap');
    bind(TYPES.OneToManyMapArgs).to(OneToManyMapArgs);
    bind<IOneToManyMap<string>>(TYPES.IOneToManyMap).to(OneToManyMap)
        .whenTargetIsDefault();
    // bind<IOneToManyMap<id>>(TYPES.IOneToManyMap).to(OneToManyMap)
    //     .whenTargetIsDefault()

    bind<SubscribableMutableStringSetArgs>
    (TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs);

    const {SubscribableArgs} = require('./app/objects/subscribable/Subscribable');
    bind(TYPES.SubscribableArgs).to(SubscribableArgs);

    const {SubscribableTree, SubscribableTreeArgs} = require('./app/objects/tree/SubscribableTree');
    bind(TYPES.SubscribableTreeArgs).to(SubscribableTreeArgs);
    bind<ISubscribableTree>(TYPES.ISubscribableTree).to(SubscribableTree);

    const {MutableSubscribableTree} = require('./app/objects/tree/MutableSubscribableTree');
    bind<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree).to(MutableSubscribableTree);

    const {MutableSubscribableTreeLocation} = require('./app/objects/treeLocation/MutableSubscribableTreeLocation');
    bind<IMutableSubscribableTreeLocation>(TYPES.IMutableSubscribableTreeLocation).to(MutableSubscribableTreeLocation);

    const {MutableSubscribableTreeUser} = require('./app/objects/treeUser/MutableSubscribableTreeUser');
    bind<IMutableSubscribableTreeUser>(TYPES.IMutableSubscribableTreeUser).to(MutableSubscribableTreeUser);

    const {MutableSubscribableContent} = require('./app/objects/content/MutableSubscribableContent');
    bind<IMutableSubscribableContent>(TYPES.IMutableSubscribableContent).to(MutableSubscribableContent);

    const {MutableSubscribableContentUser} = require('./app/objects/contentUser/MutableSubscribableContentUser');
    bind<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser).to(MutableSubscribableContentUser);

    const {SyncableMutableSubscribableTree} = require('./app/objects/tree/SyncableMutableSubscribableTree');

    bind<ISyncableMutableSubscribableTree>(TYPES.ISyncableMutableSubscribableTree).to(SyncableMutableSubscribableTree);

    const {
        SyncableMutableSubscribableTreeLocation
    } = require('./app/objects/treeLocation/SyncableMutableSubscribableTreeLocation');

    bind<ISyncableMutableSubscribableTreeLocation>(TYPES.ISyncableMutableSubscribableTreeLocation)
        .to(SyncableMutableSubscribableTreeLocation);

    const {SyncableMutableSubscribableTreeUser} = require('./app/objects/treeUser/SyncableMutableSubscribableTreeUser');

    bind<ISyncableMutableSubscribableTreeUser>(TYPES.ISyncableMutableSubscribableTreeUser)
        .to(SyncableMutableSubscribableTreeUser);

    const {SyncableMutableSubscribableContent} = require('./app/objects/content/SyncableMutableSubscribableContent');

    bind<ISyncableMutableSubscribableContent>(TYPES.ISyncableMutableSubscribableContent)
        .to(SyncableMutableSubscribableContent);

    const {SyncableMutableSubscribableContentUser}
    = require('./app/objects/contentUser/SyncableMutableSubscribableContentUser');
    bind<ISyncableMutableSubscribableContentUser>(TYPES.ISyncableMutableSubscribableContentUser)
        .to(SyncableMutableSubscribableContentUser);

    const {SubscribableTreeUser, SubscribableTreeUserArgs} = require('./app/objects/treeUser/SubscribableTreeUser');

    bind<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser).to(SubscribableTreeUser);
    bind(TYPES.SubscribableTreeUserArgs).to(SubscribableTreeUserArgs);
    bind<SubscribableContentArgs>(TYPES.SubscribableContentArgs).to(SubscribableContentArgs);

    bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE);

// tslint:disable-next-line ban-types

    const {PropertyAutoFirebaseSaver, PropertyAutoFirebaseSaverArgs}
    = require('./app/objects/dbSync/PropertyAutoFirebaseSaver');
    bind(TYPES.PropertyAutoFirebaseSaverArgs).to(PropertyAutoFirebaseSaverArgs);
    bind<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver).to(PropertyAutoFirebaseSaver);
    bind<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
        .toConstantValue((updates: IDetailedUpdates) => void 0);
    bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types

    const {PropertyFirebaseSaverArgs} = require('./app/objects/dbSync/PropertyFirebaseSaver');
    bind(TYPES.PropertyFirebaseSaverArgs).to(PropertyFirebaseSaverArgs);
    bind<ITree>(TYPES.ITree).to(SubscribableTree);
// TODO: maybe only use this constant binding for a test container. . . Not production container

    bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData);

    bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats);
});
export const components = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    // bind<TreeComponentCreatorArgs>(TYPES.TreeComponentCreatorArgs).to(TreeComponentCreatorArgs)
    // bind<ITreeComponentCreator>(TYPES.ITreeComponentCreator).to(TreeComponentCreator)
    // bind<ITree2ComponentCreator>(TYPES.ITree2ComponentCreator).to(Tree2ComponentCreator)
    // bind<Tree2ComponentCreatorArgs>(TYPES.Tree2ComponentCreatorArgs).to(Tree2ComponentCreatorArgs)

    bind<KnawledgeMapCreatorArgs>(TYPES.KnawledgeMapCreatorArgs).to(KnawledgeMapCreatorArgs);
    // bind<id>(TYPES.Id).toConstantValue(JOHN_USER_ID)
    //     .whenInjectedInto(KnawledgeMapCreatorArgs)
    const knawledgeMapCreatorMock = {
        create() {}
    };
    // bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).toConstantValue(knawledgeMapCreatorMock)
    // @injectable()
    // class KnawledgeMapCreator implements  IKnawledgeMapCreator {
    //     public create() {}
    // }
    // bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).to(KnawledgeMapCreator)

    bind<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator).to(KnawledgeMapCreator);

    const {
        TreeCreator,
        // TreeCreatorArgs
    } = require('./app/components/tree/tree');
    const {TreeCreatorArgs} = require('./app/components/tree/tree');
    bind(TYPES.TreeCreatorArgs).to(TreeCreatorArgs);
    // bind<ITreeCreator>(TYPES.ITreeCreatorClone).to(TreeCreator)
    bind<ITreeCreator>(TYPES.ITreeCreator).to(TreeCreator);

    const {NewTreeComponentCreator, NewTreeComponentCreatorArgs} = require('./app/components/newTree/newTree');
    bind<INewTreeComponentCreator>(TYPES.INewTreeComponentCreator).to(NewTreeComponentCreator);
    bind(TYPES.NewTreeComponentCreatorArgs).to(NewTreeComponentCreatorArgs);

});
// app

export const app = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IApp>(TYPES.IApp).to(App);
    bind<AppArgs>(TYPES.AppArgs).to(AppArgs);

    const {AppContainer, AppContainerArgs} = require('./app/core/appContainer');
    bind(TYPES.AppContainer).to(AppContainer);
    bind(TYPES.AppContainerArgs).to(AppContainerArgs);
});

export const state: IState
 = {
    branchesMapsData: {},
    branchesMaps: {},
    branchesMapLoader: null,
    branchesMapUtils: null,
    centeredTreeId: GLOBAL_MAP_ROOT_TREE_ID,
    currentMapId: DEFAULT_MAP_ID,
    currentHighlightedNodeId: null,
    currentStudyHeap: null,
    currentlyPlayingCategoryId: null,
    interactionMode: INTERACTION_MODES.PAUSED,
    graphData: {
        nodes: [],
        edges: [],
    },
    graph: null,
    globalDataStore: null,
    globalDataStoreObjects: {
        content: {},
        contentUsers: {},
        trees: {},
        treeUsers: {},
        treeLocations: {},
    },
    globalDataStoreData: {
        content: {},
        contentUsers: {},
        trees: {},
        treeUsers: {},
        treeLocations: {},
    },
    renderer: null,
    sigmaFactory: null,
    sigmaInstance: null,
    sigmaNodeLoader: null,
    sigmaNodeLoaderCore: null,
    sigmaNodesUpdater: null,
    sigmaEdgesUpdater: null,
    sigmaInitialized: false,
    tooltips: null,
    uri: null,
    userLoader: null,
    usersData: {},
    users: {},
    // userId: JOHN_USER_ID,
    userId: null, // JOHN_USER_ID,
    userUtils: null,
    usersDataHashmapUpdated: .5242,
};
export const misc = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<() => void>(TYPES.Function).toConstantValue(() => void 0);
    bind<any>(TYPES.Any).toConstantValue(null);
    bind<boolean>(TYPES.Boolean).toConstantValue(false);
    bind<string>(TYPES.String).toConstantValue('');
    bind<string>(TYPES.StringNotEmpty).toConstantValue('abc123');
    bind<any[]>(TYPES.Array).toDynamicValue((context: interfaces.Context) => [] )
        .whenTargetIsDefault();
// tslint:disable-next-line ban-types
    bind<id>(TYPES.Id).toConstantValue(JOHN_USER_ID);
    bind<number>(TYPES.Number).toConstantValue(0);
    bind<object>(TYPES.Object).toDynamicValue((context: interfaces.Context) => ({}));
    bind<object>(TYPES.BranchesStoreState).toConstantValue(
        state
    );

    const VueConfigurerModule = require('./app/core/VueConfigurer');
    const {VueConfigurer} = VueConfigurerModule;
    const VueConfigurerArgs = VueConfigurerModule.VueConfigurerArgs;
    // type VueConfigurerArgs = VueConfigurerModule.VueConfigurerArgs;
    bind<IVueConfigurer>(TYPES.IVueConfigurer).to(VueConfigurer);
    bind(TYPES.VueConfigurerArgs).to(VueConfigurerArgs);

});

export const login = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const {AuthListener, AuthListenerArgs} = require('./app/objects/authListener/authListener');
    bind(TYPES.AuthListenerArgs).to(AuthListenerArgs);
    bind<IAuthListener>(TYPES.IAuthListener).to(AuthListener);
});

export const storeSingletons = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {




    const {
        MutableSubscribableGlobalStore,
        MutableSubscribableGlobalStoreArgs
    } = require('./app/objects/stores/MutableSubscribableGlobalStore');

    bind(TYPES.MutableSubscribableGlobalStoreArgs)
        .to(MutableSubscribableGlobalStoreArgs);

    bind<IMutableSubscribableGlobalStore>
    (TYPES.IMutableSubscribableGlobalStore)
        .to(MutableSubscribableGlobalStore)
        .inSingletonScope()
        .whenTargetIsDefault();
        // .toConstantValue(globalStoreSingleton)

    const BranchesStore = require('./app/core/store/store').default
    bind(TYPES.BranchesStore)
        .to(BranchesStore)
        .inSingletonScope()
        .whenTargetIsDefault();

    bind<GlobalDataStoreBranchesStoreSyncerArgs>(TYPES.GlobalDataStoreBranchesStoreSyncerArgs)
        .to(GlobalDataStoreBranchesStoreSyncerArgs);
    bind<IGlobalDataStoreBranchesStoreSyncer>(TYPES.IGlobalDataStoreBranchesStoreSyncer)
        .to(GlobalDataStoreBranchesStoreSyncer);

    // rendering singletons

    const {OneToManyMap, OneToManyMapArgs} = require('./app/objects/oneToManyMap/oneToManyMap');
    const contentIdSigmaIdMapSingletonArgs /*: OneToManyMapArgs */ =
        myContainer.get/*<OneToManyMapArgs>*/(TYPES.OneToManyMapArgs);

    const contentIdSigmaIdMapSingleton: IOneToManyMap<string> = new OneToManyMap(contentIdSigmaIdMapSingletonArgs);

    bind<IOneToManyMap<string>>(TYPES.IOneToManyMap).toConstantValue(contentIdSigmaIdMapSingleton)
        .whenTargetTagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true);

    const contentIdSigmaIdMapSingletonGet
        = contentIdSigmaIdMapSingleton.get.bind(contentIdSigmaIdMapSingleton);
    bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(contentIdSigmaIdMapSingletonGet)
        .whenTargetTagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true);
    // contentIdSigmaIdMapSingletonGet['_id'] = Math.random()
    // log('the contentIdSigmaIdMapSingletonGet id from inversify.config is ', contentIdSigmaIdMapSingletonGet['_id'])

    const {SigmaRenderManager, SigmaRenderManagerArgs} = require('./app/objects/sigmaNode/SigmaRenderManager');
    bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        .to(SigmaRenderManager)
        .inSingletonScope()
        .whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);

    const {SigmaNodesUpdater, SigmaNodesUpdaterArgs} = require('./app/objects/sigmaNode/SigmaNodesUpdater');
    bind(TYPES.SigmaNodesUpdaterArgs).to(SigmaNodesUpdaterArgs)
    bind<ISigmaNodesUpdater>(TYPES.ISigmaNodesUpdater)
        .to(SigmaNodesUpdater)
        .inSingletonScope()
        .whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);

    const canvasUI: IUI = myContainer.get<CanvasUI>(TYPES.CanvasUI);
    bind<IUI[]>(TYPES.Array).toConstantValue([canvasUI])
        .whenTargetTagged(TAGS.DEFAULT_UIS_ARRAY, true);

});
export function myContainerLoadMockFirebaseReferences() {
    myContainer.load(mockFirebaseReferences);
}
export function myContainerLoadAllModules({fakeSigma}: {fakeSigma: boolean}) {
    myContainer.load(firebaseReferences);
    myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma});
}
export function myContainerUnloadAllModules({fakeSigma}: {fakeSigma: boolean}) {
    myContainer.unload(misc)
    myContainer.unload(login)
    myContainer.unload(treeStoreSourceSingletonModule)
    myContainer.unload(stores)
    myContainer.unload(dataObjects)
    if (fakeSigma) {
        myContainer.unload(mockSigma);
    } else {
        myContainer.unload(sigma);
    }
    myContainer.unload(rendering);
    myContainer.unload(loaders);
    myContainer.unload(storeSingletons);
    myContainer.unload(components);
    myContainer.unload(app);
}

export function myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma}: {fakeSigma: boolean}) {
    myContainer.load(misc);
    myContainer.load(login);
    myContainer.load(treeStoreSourceSingletonModule);
    myContainer.load(stores);
    myContainer.load(dataObjects);
    if (fakeSigma) {
        myContainer.load(mockSigma);
    } else {
        myContainer.load(sigma);
    }
    myContainer.load(rendering);
    myContainer.load(loaders);
    myContainer.load(storeSingletons);
    myContainer.load(components);
    myContainer.load(app);
}

console.log('checkpoint 1.195', Date.now() - start)
export {myContainer};
