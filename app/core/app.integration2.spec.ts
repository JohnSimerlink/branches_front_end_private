import firebase from 'firebase'
import {MockFirebase} from 'firebase-mock'
import {myContainer} from '../../inversify.config';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {
    IRenderedNodesManager, ISigmaNodeCreator, ISigmaNodeCreatorCaller,
    ISigmaNodeCreatorCore
} from '../objects/interfaces';
import {ISigmaRenderManager} from '../objects/interfaces';
import {
    fGetSigmaIdsForContentId, IHash,
    IMutableSubscribableTree, IMutableSubscribableTreeLocation, IRenderedNodesManagerCore,
    ISigmaNode,
    ISubscribableStoreSource,
} from '../objects/interfaces';
import {ISigmaNodesUpdater} from '../objects/interfaces';
import {ITreeDataWithoutId, ITreeLocationData} from '../objects/interfaces';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import {TYPES} from '../objects/types';
import {TREE_ID} from '../testHelpers/testHelpers';
import {App} from './app';
import {SigmaNodeCreatorCore} from '../objects/sigmaNode/SigmaNodeCreatorCore';
import {SigmaNodeCreator, SigmaNodeCreatorCaller} from '../objects/sigmaNode/SigmaNodeCreator';
import {SigmaRenderManager} from '../objects/sigmaNode/SigmaRenderManager';

describe('App integration test 2 - loadTree/loadTreeLocation -> renderedSigmaNodes', () => {
    it('once a tree/treeLocation is loaded,' +
        ' that treeId should appear as a node in the renderedSigmaNodes set', async () => {
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

        const treeStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLocationStoreSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
        (TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLoader({firebaseRef: firebaseTreesRef, storeSource: treeStoreSource})
        const treeLocationLoader
            = new TreeLocationLoader({firebaseRef: firebaseTreeLocationsRef, storeSource: treeLocationStoreSource})

        const sigmaNodes = {}
        const sigmaNodeCreatorCore: ISigmaNodeCreatorCore = new SigmaNodeCreatorCore({sigmaNodes})
        const sigmaNodeCreator: ISigmaNodeCreator = new SigmaNodeCreator({sigmaNodeCreatorCore})
        const sigmaNodeCreatorCaller: ISigmaNodeCreatorCaller = new SigmaNodeCreatorCaller({sigmaNodeCreator})
        const getSigmaIdsForContentId: fGetSigmaIdsForContentId = () => {
            return []
        }
        const renderedNodes: IHash<ISigmaNode> = {}
        const allSigmaNodes: IHash<ISigmaNode> = {}
        const renderedNodesManagerCore: IRenderedNodesManagerCore
            = new RenderedNodesManagerCore({allSigmaNodes, renderedNodes})
        const renderedNodesManager: IRenderedNodesManager = new RenderedNodesManager({renderedNodesManagerCore})
        const sigmaRenderManager: ISigmaRenderManager
            = new SigmaRenderManager({treeLocationDataLoadedIdsSet: {}, treeDataLoadedIdsSet: {}, updatesCallbacks: []})
        renderedNodesManager.subscribe(sigmaRenderManager)
        const sigmaNodesUpdater: ISigmaNodesUpdater
            = new SigmaNodesUpdater({sigmaRenderManager, sigmaNodes, getSigmaIdsForContentId})

        sigmaNodeCreatorCaller.subscribe(treeStoreSource)
        sigmaNodeCreatorCaller.subscribe(treeLocationStoreSource)

        treeRef.fakeEvent('value', undefined, sampleTreeData)
        treeLoader.downloadData(treeIdToDownload)
        treeRef.flush()

        treeLocationRef.fakeEvent('value', undefined, sampleTreeLocationData)
        treeLocationLoader.downloadData(treeIdToDownload)
        treeLocationRef.flush()

    })
})
