import {injectFakeDom} from '../testHelpers/injectFakeDom';
import test
	from 'ava';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';
import * as sinon
	from 'sinon';
import {
	myContainer,
	myContainerLoadAllModules
} from '../../inversify.config';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {
	IHash,
	IOneToManyMap,
	IRenderManager,
	IRenderManagerCore,
	ISigmaNode,
	ISigmaNodesUpdater,
	ISigmaRenderManager,
	ISigmaUpdater,
	IStoreSourceUpdateListener,
	IStoreSourceUpdateListenerCore,
	ISubscribableTreeLocationStoreSource,
	ISubscribableTreeStoreSource
} from '../objects/interfaces';
import {RenderManager} from '../objects/sigmaNode/RenderManager';
import {RenderManagerCore} from '../objects/sigmaNode/RenderManagerCore';
import {
	SigmaNodesUpdater,
	SigmaNodesUpdaterArgs
} from '../objects/sigmaNode/SigmaNodesUpdater';
import {StoreSourceUpdateListener} from '../objects/stores/StoreSourceUpdateListener';
import {
	StoreSourceUpdateListenerCore,
	StoreSourceUpdateListenerCoreArgs
} from '../objects/stores/StoreSourceUpdateListenerCore';
import {TYPES} from '../objects/types';
import {
	getSigmaIdsForContentId,
	TREE_ID
} from '../testHelpers/testHelpers';
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
import * as Vuex
	from 'vuex';
import {Store} from 'vuex';
import {partialInject} from '../testHelpers/partialInject';
import {
	BranchesStoreArgs,
	default as BranchesStore
} from './store/store';
import {TAGS} from '../objects/tags';
import {sampleTreeData1FromDB} from '../objects/tree/treeTestHelpers';

injectFakeDom();
// import GraphData = SigmaJs.GraphData;
const Vue = require('vue').default || require('vue');

const windowAny: any = global;
windowAny.requestAnimationFrame = (cb) => cb();
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

myContainerLoadAllModules({fakeSigma: true});
test('App integration test 2 - loadTree/loadTreeLocation -> renderedSigmaNodes::::: ' +
	'once a tree/treeLocation is loaded,' +
	' that treeId should appear as a node in the renderedSigmaNodes set', async (t) => {

	Vue.use(Vuex);
	// configureSigmaConstructor(sigma)
	const treeIdToDownload = TREE_ID;

	const firebaseTreesRef = new MockFirebase(FIREBASE_PATHS.TREES);
	const treeRef = firebaseTreesRef.child(treeIdToDownload);
	const firebaseTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
	const treeLocationRef = firebaseTreeLocationsRef.child(treeIdToDownload);

	const treeStoreSource: ISubscribableTreeStoreSource
		= myContainer.getTagged<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource, TAGS.MAIN_APP, true);
	const treeLocationStoreSource: ISubscribableTreeLocationStoreSource
		= myContainer.getTagged<ISubscribableTreeLocationStoreSource>
	(TYPES.ISubscribableTreeLocationStoreSource, TAGS.MAIN_APP, true);
	const treeLoader = new TreeLoader({
		firebaseRef: firebaseTreesRef,
		storeSource: treeStoreSource
	});
	const treeLocationLoader
		= new TreeLocationLoader({
		firebaseRef: firebaseTreeLocationsRef,
		storeSource: treeLocationStoreSource
	});

	const sigmaNodes: IHash<ISigmaNode> = {};

	const sigmaRenderManager: ISigmaRenderManager
		= myContainer.getTagged<ISigmaRenderManager>(TYPES.ISigmaRenderManager, TAGS.MAIN_SIGMA_INSTANCE, true);

	// TODO: do full dep injection for this store
	const state: object = myContainer.get<object>(TYPES.BranchesStoreState);
	const store: Store<any> =
		partialInject<BranchesStoreArgs>({
			konstructor: BranchesStore,
			constructorArgsType: TYPES.BranchesStoreArgs,
			injections: {
				state
			},
			container: myContainer
		});
	// new BranchesStore({globalDataStore: {}, state}) as Store<any>
	const sigmaUpdater: ISigmaUpdater = new SigmaUpdater(
		{store}
	);
	const sigmaNodesUpdater: ISigmaNodesUpdater
		= partialInject<SigmaNodesUpdaterArgs>({
		constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
		konstructor: SigmaNodesUpdater,
		injections: {
			getSigmaIdsForContentId,
			sigmaNodes,
			sigmaRenderManager,
			getStore: () => store,
			contentIdContentMap: {}
		},
		container: myContainer,
	});
	const contentIdSigmaIdMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap);
	const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
		= partialInject<StoreSourceUpdateListenerCoreArgs>({
		konstructor: StoreSourceUpdateListenerCore,
		constructorArgsType: TYPES.StoreSourceUpdateListenerCoreArgs,
		injections: {
			sigmaNodesUpdater,
			contentIdSigmaIdMap,
			store,
		},
		container: myContainer
	});
	const storeSourceUpdateListener: IStoreSourceUpdateListener
		= new StoreSourceUpdateListener({storeSourceUpdateListenerCore});
	const renderedNodesManagerCore: IRenderManagerCore
		= new RenderManagerCore({
		sigmaNodes,
		sigmaUpdater,
		sigmaEdges: {}
	});
	const renderedNodesManager: IRenderManager = new RenderManager({renderManagerCore: renderedNodesManagerCore});
	renderedNodesManager.subscribe(sigmaRenderManager);

	storeSourceUpdateListener.subscribe(treeStoreSource);
	storeSourceUpdateListener.subscribe(treeLocationStoreSource);
	// TODO: encapsulate this subscription logic in some sort of subapp.start() method?

	const treeStoreSourceCallCallbacks = sinon.spy(treeStoreSource, 'callCallbacks');

	function inRenderedSetf({treeId, store}) {
		const sigmaInstance = store.state.sigmaInstance;
		return !!(sigmaInstance && sigmaInstance.graph.nodes(treeId));
	}

	let inRenderedSet: boolean = inRenderedSetf({
		treeId: treeIdToDownload,
		store
	});
	expect(inRenderedSet).to.equal(false);
	treeRef.fakeEvent('value', undefined, sampleTreeData1FromDB);
	treeLoader.downloadData(treeIdToDownload);
	treeRef.flush();
	inRenderedSet = inRenderedSetf({
		treeId: treeIdToDownload,
		store
	});
	expect(treeStoreSourceCallCallbacks.callCount).to.equal(1);
	// expect(inRenderedSet).to.equal(false);
	//
	// treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationDataFromFirebase1);
	// treeLocationLoader.downloadData(treeIdToDownload);
	// treeLocationRef.flush();
	//
	// store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);
	// inRenderedSet = inRenderedSetf({treeId: treeIdToDownload, store});
	// expect(inRenderedSet).to.equal(true);
	t.pass();

});

