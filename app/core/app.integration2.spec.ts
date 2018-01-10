import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as sinon from 'sinon'
import {myContainer} from '../../inversify.config';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {ISigma, ISigmaUpdater, ITreeDataWithoutId, ITreeLocationData} from '../objects/interfaces';
import {
    IRenderedNodesManager,
    IStoreSourceUpdateListener
} from '../objects/interfaces';
import {
    IHash,
    IRenderedNodesManagerCore,
    ISigmaNode, ISigmaNodesUpdater, IStoreSourceUpdateListenerCore,
} from '../objects/interfaces';
import {ISigmaRenderManager, ISubscribableTreeLocationStoreSource, ISubscribableTreeStoreSource} from '../objects/interfaces';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import BranchesStore from './store2'
import {StoreSourceUpdateListener} from '../objects/stores/StoreSourceUpdateListener';
import {StoreSourceUpdateListenerCore} from '../objects/stores/StoreSourceUpdateListenerCore';
import {TYPES} from '../objects/types';
import {TREE_ID} from '../testHelpers/testHelpers';
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
import {error} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
// import GraphData = SigmaJs.GraphData;
import {configureSigma} from '../objects/sigmaNode/configureSigma'
import {log} from './log'
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

test('App integration test 2 - loadTree/loadTreeLocation -> renderedSigmaNodes::::: ' +
    'once a tree/treeLocation is loaded,' +
    ' that treeId should appear as a node in the renderedSigmaNodes set', async (t) => {
    // configureSigma(sigma)
    const treeIdToDownload = TREE_ID

    const sampleTreeData: ITreeDataWithoutId = {
        contentId: '12345532',
        parentId: '493284',
        children: ['2948, 2947']
    }

    const sampleTreeLocationData: ITreeLocationData = {
        point: {
            x: 5,
            y: 8,
        }
    }

    const firebaseTreesRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const treeRef = firebaseTreesRef.child(treeIdToDownload)
    const firebaseTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS)
    const treeLocationRef = firebaseTreeLocationsRef.child(treeIdToDownload)

    const treeStoreSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLocationStoreSource: ISubscribableTreeLocationStoreSource
        = myContainer.get<ISubscribableTreeLocationStoreSource>
    (TYPES.ISubscribableTreeLocationStoreSource)
    const treeLoader = new TreeLoader({firebaseRef: firebaseTreesRef, storeSource: treeStoreSource})
    const treeLocationLoader
        = new TreeLocationLoader({firebaseRef: firebaseTreeLocationsRef, storeSource: treeLocationStoreSource})

    const sigmaNodes: IHash<ISigmaNode> = {}

    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    const sigmaNodesUpdater: ISigmaNodesUpdater
        = new SigmaNodesUpdater({sigmaNodes, sigmaRenderManager, getSigmaIdsForContentId: () => void 0})

    const sigmaInstance: ISigma /* SigmaJs.Sigma */ = myContainer.get<ISigma>(TYPES.ISigma)

    const camera = sigmaInstance.cameras[0]
    function focusNode(node) {
        if (!node) {
            error('Tried to go to node');
            error(node);
            return;
        }
        const cameraCoord = {
            x: node['read_cam0:x'],
            y: node['read_cam0:y'],
            ratio: 0.20
        };
        camera.goTo(cameraCoord);
    }

    const store = new BranchesStore()
    const sigmaUpdater: ISigmaUpdater = new SigmaUpdater(
        {store}
    )
    const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
        = new StoreSourceUpdateListenerCore({sigmaNodes, sigmaNodesUpdater})
    const storeSourceUpdateListener: IStoreSourceUpdateListener
        = new StoreSourceUpdateListener({storeSourceUpdateListenerCore})
    const renderedNodesManagerCore: IRenderedNodesManagerCore
        = new RenderedNodesManagerCore({sigmaNodes, addNodeToSigma: sigmaUpdater.addNode.bind(sigmaUpdater)})
    const renderedNodesManager: IRenderedNodesManager = new RenderedNodesManager({renderedNodesManagerCore})
    renderedNodesManager.subscribe(sigmaRenderManager)

    storeSourceUpdateListener.subscribe(treeStoreSource)
    storeSourceUpdateListener.subscribe(treeLocationStoreSource)

    const treeStoreSourceCallCallbacks = sinon.spy(treeStoreSource, 'callCallbacks')

    let inRenderedSet: boolean = !!sigmaInstance.graph.nodes(treeIdToDownload)
    expect(inRenderedSet).to.equal(false)
    treeRef.fakeEvent('value', undefined, sampleTreeData)
    treeLoader.downloadData(treeIdToDownload)
    treeRef.flush()
    inRenderedSet = !!sigmaInstance.graph.nodes(treeIdToDownload)
    expect(treeStoreSourceCallCallbacks.callCount).to.equal(1)
    // expect(sigmaNodeCreatorReceiveUpdateSpy.callCount).to.equal(1)
    expect(inRenderedSet).to.equal(false)

    treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationData)
    treeLocationLoader.downloadData(treeIdToDownload)
    treeLocationRef.flush()
    // expect(sigmaNodeCreatorReceiveUpdateSpy.callCount).to.equal(2)

    inRenderedSet = !!sigmaInstance.graph.nodes(treeIdToDownload)
    expect(inRenderedSet).to.equal(true)
    t.pass()

})
