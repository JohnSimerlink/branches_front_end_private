import {getASampleContent} from './app/objects/content/contentTestHelpers';

import * as firebase_typings from './app/core/firebase_interfaces';
type Reference = firebase_typings.database.Reference;
import {log} from './app/core/log';
import {Container, ContainerModule, injectable, interfaces} from 'inversify';
import 'reflect-metadata';
import {FIREBASE_PATHS} from './app/loaders/paths';
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
	IBranchesMapLoaderCore, IBranchesMapUtils, ISigmaFactory, ITreeLocationData, FGetStore, fImportSigma, ISigmaNodesRemover,
} from './app/objects/interfaces';
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
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {defaultProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
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
import {DEFAULT_MAP_ID, GRAPH_CONTAINER_ID, JOHN_USER_ID, GLOBAL_MAP_ROOT_TREE_ID} from './app/core/globals';

import {TAGS} from './app/objects/tags';

import {MockSigmaFactory} from './app/testHelpers/MockSigma';
import {INTERACTION_MODES} from './app/core/store/interactionModes';
import {Store} from 'vuex';
import {getASampleContentUser} from './app/objects/contentUser/contentUserTestHelpers';
import {getSomewhatRandomId} from './app/testHelpers/randomValues';

const myContainer = new Container();

export const firebaseReferences = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
	const firebase = require('firebase').default || require('firebase');

	const firebaseDevConfig = require('./app/objects/firebase.dev.config.json');
	const firebaseConfig = firebaseDevConfig;
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

	// treeLoader

	const {TreeLoader, TreeLoaderArgs} = require('./app/loaders/tree/TreeLoader');
	myContainer.bind(TYPES.TreeLoaderArgs).to(TreeLoaderArgs);
	myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)
		.whenTargetIsDefault();
	myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(SpecialTreeLoader)
		.whenTargetTagged(TAGS.SPECIAL_TREE_LOADER, true);
	const {TreeLoaderAndAutoSaver, TreeLoaderAndAutoSaverArgs} = require('./app/loaders/tree/TreeLoaderAndAutoSaver');
	myContainer.bind(TYPES.TreeLoaderAndAutoSaverArgs).to(TreeLoaderAndAutoSaverArgs);
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

	const {UserLoader, UserLoaderArgs} = require('./app/loaders/user/UserLoader');
	myContainer.bind(TYPES.UserLoaderArgs).to(UserLoaderArgs);
	myContainer.bind<IUserLoader>(TYPES.IUserLoader).to(UserLoader)
		.whenTargetIsDefault()

	const {UserLoaderAndAutoSaver, UserLoaderAndAutoSaverArgs} = require('./app/loaders/user/UserLoaderAndAutoSaver');
	myContainer.bind(TYPES.UserLoaderAndAutoSaverArgs)
		.to(UserLoaderAndAutoSaverArgs);
	myContainer.bind<IUserLoader>(TYPES.IUserLoader)
		.to(UserLoaderAndAutoSaver)
		.whenTargetTagged(TAGS.AUTO_SAVER, true);

	const {UserUtils, UserUtilsArgs} = require('./app/objects/user/usersUtils');
	myContainer.bind(TYPES.UserUtilsArgs).to(UserUtilsArgs);
	myContainer.bind<IUserUtils>(TYPES.IUserUtils).to(UserUtils);

	// loaders

	const {BranchesMapLoader, BranchesMapLoaderArgs} = require('./app/loaders/branchesMap/BranchesMapLoader');
	const {BranchesMapLoaderCoreArgs, BranchesMapLoaderCore}
	= require('./app/loaders/branchesMap/BranchesMapLoaderCore');
	myContainer.bind(TYPES.BranchesMapLoaderArgs).to(BranchesMapLoaderArgs);
	myContainer.bind<IBranchesMapLoader>(TYPES.IBranchesMapLoader).to(BranchesMapLoader);
	myContainer.bind(TYPES.BranchesMapLoaderCoreArgs).to(BranchesMapLoaderCoreArgs);
	myContainer.bind<IBranchesMapLoaderCore>(TYPES.IBranchesMapLoaderCore).to(BranchesMapLoaderCore);

	const {BranchesMapUtils, BranchesMapUtilsArgs} = require('./app/objects/branchesMap/branchesMapUtils');
	myContainer.bind(TYPES.BranchesMapUtilsArgs).to(BranchesMapUtilsArgs);
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

	const {SigmaNodeLoader, SigmaNodeLoaderArgs} = require('./app/loaders/sigmaNode/sigmaNodeLoader');
	const {SigmaNodeLoaderCore, SigmaNodeLoaderCoreArgs} = require('./app/loaders/sigmaNode/sigmaNodeLoaderCore');
	myContainer.bind(TYPES.SigmaNodeLoaderCoreArgs).to(SigmaNodeLoaderCoreArgs);
	myContainer.bind<ISigmaNodeLoaderCore>(TYPES.ISigmaNodeLoaderCore).to(SigmaNodeLoaderCore)
		.inSingletonScope()
		.whenTargetIsDefault();
	myContainer.bind(TYPES.SigmaNodeLoaderArgs).to(SigmaNodeLoaderArgs);
	myContainer.bind<ISigmaNodeLoader>(TYPES.ISigmaNodeLoader).to(SigmaNodeLoader)
		.inSingletonScope()
		.whenTargetIsDefault();


	const {FamilyLoader, FamilyLoaderArgs} = require('./app/loaders/sigmaNode/familyLoader');
	myContainer.bind<IFamilyLoader>(TYPES.IFamilyLoader).to(FamilyLoader);
	myContainer.bind(TYPES.FamilyLoaderArgs).to(FamilyLoaderArgs);

	const {FamilyLoaderCore, FamilyLoaderCoreArgs} = require('./app/loaders/sigmaNode/familyLoaderCore');
	myContainer.bind<IFamilyLoaderCore>(TYPES.IFamilyLoaderCore).to(FamilyLoaderCore);
	myContainer.bind(TYPES.FamilyLoaderCoreArgs).to(FamilyLoaderCoreArgs);

});

export const treeStoreSourceSingletonModule
	= new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

});

export const customStores =
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

	bind(TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs)
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

	const {
		OverdueListenerMutableSubscribableContentUserStore,
		OverdueListenerMutableSubscribableContentUserStoreArgs
	} = require('./app/objects/stores/contentUser/OverdueListenerMutableSubscribableContentUserStore');
	bind(TYPES.OverdueListenerMutableSubscribableContentUserStoreArgs)
		.to(OverdueListenerMutableSubscribableContentUserStoreArgs);
	bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
		.to(OverdueListenerMutableSubscribableContentUserStore)
		.whenTargetTagged(TAGS.OVERDUE_LISTENER, true);


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



		// ^^ This will get overriden in the BranchesStore constructor
});
//
const rendering = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
	bind<radian>(TYPES.radian).toConstantValue(0);
	bind<FGetStore>(TYPES.fGetStore).toConstantValue(() => { return { commit(){}} as any as Store<any>})

	const {
		CanvasUI,
		CanvasUIArgs
	} = require('./app/objects/sigmaNode/CanvasUI');
	bind(TYPES.CanvasUI).to(CanvasUI);
	bind(TYPES.CanvasUIArgs)
		.to(CanvasUIArgs);

	// TODO: fix these bindings for if we have multiple sigma instances.
	bind<ISigmaNodes>(TYPES.ISigmaNodes).toConstantValue({});
	bind<ISigmaEdges>(TYPES.ISigmaEdges).toConstantValue({});

	bind(TYPES.IContentUserData).toDynamicValue((context: interfaces.Context) => {
		return getASampleContentUser({contentId: getSomewhatRandomId()});
	})
	bind(TYPES.IContentData).toDynamicValue((context: interfaces.Context) => {
		return getASampleContent();
	})
	const {SigmaNode, SigmaNodeArgs} = require('./app/objects/sigmaNode/SigmaNode');
	bind(TYPES.SigmaNodeArgs).to(SigmaNodeArgs);
	bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode);

	const {RenderManager, RenderManagerArgs} = require('./app/objects/sigmaNode/RenderManager');

	const {SigmaUpdaterArgs, SigmaUpdater} = require('./app/objects/sigmaUpdater/sigmaUpdater');
	bind(TYPES.SigmaUpdaterArgs).to(SigmaUpdaterArgs);

	// bind<ISigma>(TYPES.ISigma).toConstantValue(sigmaInstance) // << TODO: I think this is only used in unit tests

	bind<ISigmaUpdater>(TYPES.ISigmaUpdater).to(SigmaUpdater);

	const {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs}
	= require('./app/objects/stores/StoreSourceUpdateListener');
	const {
		StoreSourceUpdateListenerCore,
		StoreSourceUpdateListenerCoreArgs
	} = require('./app/objects/stores/StoreSourceUpdateListenerCore');
	bind(TYPES.StoreSourceUpdateListenerArgs).to(StoreSourceUpdateListenerArgs);
	bind<IStoreSourceUpdateListener>(TYPES.IStoreSourceUpdateListener).to(StoreSourceUpdateListener);

	bind(TYPES.StoreSourceUpdateListenerCoreArgs)
		.to(StoreSourceUpdateListenerCoreArgs);
	bind<IStoreSourceUpdateListenerCore>(TYPES.IStoreSourceUpdateListenerCore).to(StoreSourceUpdateListenerCore);

	bind<IRenderManager>(TYPES.IRenderManager).to(RenderManager);

	const {RenderManagerCore, RenderManagerCoreArgs} = require('./app/objects/sigmaNode/RenderManagerCore');
	bind<IRenderManagerCore>(TYPES.IRenderManagerCore).to(RenderManagerCore);
	bind(TYPES.RenderedNodesManagerArgs).to(RenderManagerArgs);
	bind(TYPES.RenderedNodesManagerCoreArgs).to(RenderManagerCoreArgs);
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

	const {SigmaEdgesUpdater, SigmaEdgesUpdaterArgs} = require('./app/objects/sigmaEdge/sigmaEdgesUpdater');
	bind<ISigmaEdgesUpdater>(TYPES.ISigmaEdgesUpdater)
		.to(SigmaEdgesUpdater)
		.inSingletonScope()
		.whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);
	bind(TYPES.SigmaEdgesUpdaterArgs).to(SigmaEdgesUpdaterArgs);

	const {importSigma} = require('./other_imports/importSigma');
	bind<fImportSigma>(TYPES.fImportSigma).toConstantValue(importSigma)

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
	bind(TYPES.SigmaRenderManagerArgs).to(SigmaRenderManagerArgs);

	const {SigmaNodesRemover, SigmaNodesRemoverArgs} = require('./app/objects/sigmaNode/SigmaNodesRemover');

	bind(TYPES.SigmaNodesRemoverArgs).to(SigmaNodesRemoverArgs)
	bind<ISigmaNodesRemover>(TYPES.ISigmaNodesRemover)
		.to(SigmaNodesRemover)
		.inSingletonScope()
		.whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);

	const {SigmaNodesUpdater, SigmaNodesUpdaterArgs} = require('./app/objects/sigmaNode/SigmaNodesUpdater');

	bind(TYPES.SigmaNodesUpdaterArgs).to(SigmaNodesUpdaterArgs)
	bind<ISigmaNodesUpdater>(TYPES.ISigmaNodesUpdater)
		.to(SigmaNodesUpdater)
		.inSingletonScope()
		.whenTargetTagged(TAGS.MAIN_SIGMA_INSTANCE, true);

	const canvasUI: IUI = myContainer.get(TYPES.CanvasUI);
	bind<IUI[]>(TYPES.Array).toConstantValue([canvasUI])
		.whenTargetTagged(TAGS.DEFAULT_UIS_ARRAY, true);



});
const sigma = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

	const {SigmaFactory, SigmaFactoryArgs} = require('./other_imports/sigma/sigma.factory');
	bind(TYPES.SigmaFactoryArgs).to(SigmaFactoryArgs);
	bind<ISigmaFactory>(TYPES.ISigmaFactory).to(SigmaFactory);
});
const mockSigma = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
	bind<ISigmaFactory>(TYPES.ISigmaFactory).to(MockSigmaFactory);
});
//
const dataObjects = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

	const {ContentUserData, ContentUserDataArgs} = require('./app/objects/contentUser/ContentUserData');
	bind(TYPES.ContentUserDataArgs).to(ContentUserDataArgs);

	const {sampleTreeLocationData1} = require('./app/objects/treeLocation/treeLocationTestHelpers');
	bind<ITreeLocationData>(TYPES.ITreeLocationData).toConstantValue(sampleTreeLocationData1);

	const {MutableSubscribablePoint, MutableSubscribablePointArgs}
	= require('./app/objects/point/MutableSubscribablePoint');
	bind(TYPES.MutableSubscribablePointArgs).to(MutableSubscribablePointArgs);
	bind<IMutableSubscribablePoint>(TYPES.IMutableSubscribablePoint).to(MutableSubscribablePoint);

	const {SubscribableContent, SubscribableContentArgs} = require('./app/objects/content/SubscribableContent');
	bind<ISubscribableContent>(TYPES.ISubscribableContent).to(SubscribableContent);
	bind(TYPES.SubscribableContentArgs).to(SubscribableContentArgs);

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
	const {
		MutableSubscribableField,
		MutableSubscribableFieldArgs
	} = require('./app/objects/field/MutableSubscribableField');
	bind<IMutableSubscribableField<boolean>>(TYPES.IMutableSubscribableBoolean).to(MutableSubscribableField);
	bind(TYPES.MutableSubscribableFieldArgs).to(MutableSubscribableFieldArgs);
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

	const {
		MutableSubscribableStringSet,
		MutableSubscribableStringSetArgs
	} = require('./app/objects/set/MutableSubscribableStringSet');
	bind<IMutableSubscribableStringSet>(TYPES.ISubscribableMutableStringSet).to(MutableSubscribableStringSet);
	bind(TYPES.MutableSubscribableStringSetArgs).to(MutableSubscribableStringSetArgs);
	bind<IMutableStringSet>(TYPES.IMutableStringSet).to(MutableSubscribableStringSet);
//

	const {OneToManyMap, OneToManyMapArgs} = require('./app/objects/oneToManyMap/oneToManyMap');
	bind(TYPES.OneToManyMapArgs).to(OneToManyMapArgs);
	bind<IOneToManyMap<string>>(TYPES.IOneToManyMap).to(OneToManyMap)
		.whenTargetIsDefault();
	// bind<IOneToManyMap<id>>(TYPES.IOneToManyMap).to(OneToManyMap)
	//     .whenTargetIsDefault()

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

	bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE);

// tslint:disable-next-line ban-types

	const {PropertyAutoFirebaseSaver, PropertyAutoFirebaseSaverArgs}
	= require('./app/objects/dbSync/PropertyAutoFirebaseSaver');
	bind(TYPES.PropertyAutoFirebaseSaverArgs).to(PropertyAutoFirebaseSaverArgs);
	bind<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver).to(PropertyAutoFirebaseSaver);
	bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types

	const {PropertyFirebaseSaverArgs} = require('./app/objects/dbSync/PropertyFirebaseSaver');
	bind(TYPES.PropertyFirebaseSaverArgs).to(PropertyFirebaseSaverArgs);
	bind<ITree>(TYPES.ITree).to(SubscribableTree);
// TODO: maybe only use this constant binding for a test container. . . Not production container

	// TODO: remove test bindings out of object graph into a test helpers file
	bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats);
});
export const components = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {

	const {KnawledgeMapCreator, KnawledgeMapCreatorArgs} = require('./app/components/knawledgeMap/KnawledgeMap');
	bind(TYPES.KnawledgeMapCreatorArgs).to(KnawledgeMapCreatorArgs);
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
	const {App, AppArgs} = require('./app/core/app');
	bind<IApp>(TYPES.IApp).to(App);
	bind(TYPES.AppArgs).to(AppArgs);

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
	// .toConstantValue(globalStoreSingleton)

	const {BranchesStoreArgs, default: BranchesStore} = require('./app/core/store/store');
	bind(TYPES.BranchesStoreArgs).to(BranchesStoreArgs);

	const Vue = require('vue').default || require('vue');
	const Vuex = require('vuex').default || require('vuex');
	Vue.use(Vuex);
	bind(TYPES.BranchesStore)
		.to(BranchesStore)
		.inSingletonScope()
		.whenTargetIsDefault();

	const {
		GlobalDataStoreBranchesStoreSyncer,
		GlobalDataStoreBranchesStoreSyncerArgs
	} = require('./app/core/globalDataStoreBranchesStoreSyncer');
	bind(TYPES.GlobalDataStoreBranchesStoreSyncerArgs)
		.to(GlobalDataStoreBranchesStoreSyncerArgs);
	bind<IGlobalDataStoreBranchesStoreSyncer>(TYPES.IGlobalDataStoreBranchesStoreSyncer)
		.to(GlobalDataStoreBranchesStoreSyncer);

});
export function myContainerLoadMockFirebaseReferences() {
	myContainer.load(mockFirebaseReferences);
}
export function myContainerLoadAllModules({fakeSigma}: {fakeSigma: boolean}) {
	myContainer.load(firebaseReferences);
	myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma});
}
export function myContainerUnloadAllModules({fakeSigma}: {fakeSigma: boolean}) {
	myContainer.unload(misc);
	myContainer.unload(login)
	myContainer.unload(treeStoreSourceSingletonModule)
	myContainer.unload(customStores)
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

export function myContainerLoadLoaders() {
	myContainer.load(misc);
	myContainer.load(mockFirebaseReferences);
	myContainer.load(dataObjects);
	myContainer.load(customStores);
	myContainer.load(loaders);
}
export function myContainerLoadRendering() {
	myContainer.load(misc);
	myContainer.load(dataObjects);
	myContainer.load(storeSingletons);
	myContainer.load(rendering);
}
export function myContainerLoadDataObjects() {
	myContainer.load(dataObjects);
}
export function myContainerLoadCustomStores() {
	myContainer.load(mockFirebaseReferences);
	myContainer.load(misc);
	myContainer.load(customStores);
}
export function myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma}: {fakeSigma: boolean}) {
	myContainer.load(misc);
	myContainer.load(login);
	myContainer.load(treeStoreSourceSingletonModule);
	myContainer.load(customStores);
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

export {myContainer};

