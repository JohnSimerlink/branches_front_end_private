// import firebase from 'firebase'
// import {myContainer} from '../../inversify.config';
// import {FIREBASE_PATHS} from '../loaders/paths';
// import {TreeLoader} from '../loaders/tree/TreeLoader';
// import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
// import {IMutableSubscribableGlobalStore, IUI} from '../objects/interfaces';
// import {IRenderedNodesManager} from '../objects/interfaces';
// import {ISigmaRenderManager} from '../objects/interfaces';
// import {
//     fGetSigmaIdsForContentId, IHash,
//     IMutableSubscribableTree, IMutableSubscribableTreeLocation, IRenderedNodesManagerCore,
//     ISigmaNode,
//     ISubscribableStoreSource,
// } from '../objects/interfaces';
// import {ISigmaNodesUpdater} from '../objects/interfaces';
// import {IApp} from '../objects/interfaces';
// import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
// import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
// import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
// import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
// import {TYPES} from '../objects/types';
// import {TREE_ID} from '../testHelpers/testHelpers';
// import {App} from './app';
// import {MockFirebase} from 'firebase-mock'
//
// describe('App integration test 2 - loadTree/loadTreeLocation -> renderedSigmaNodes', () => {
//     it('once a tree/treeLocation is loaded,' +
//         ' that treeId should appear as a node in the renderedSigmaNodes set', async () => {
//         const treeIdToDownload = TREE_ID
//
//         const firebaseTreesRef: Firebase = new MockFirebase(FIREBASE_PATHS.TREES)
//         const treeRef: Firebase = firebaseTreesRef.child(treeIdToDownload)
//         const firebaseTreeLocationsRef: Firebase = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS)
//         const treeLocationRef: Firebase = firebaseTreeLocationsRef.child(treeIdToDownload)
//         const treeStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
//             = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
//         const treeLocationStoreSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
//             = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
//         (TYPES.ISubscribableStoreSource)
//         const treeLoader = new TreeLoader({firebaseRef: firebaseTreesRef, storeSource: treeStoreSource})
//         const treeLocationLoader
//             = new TreeLocationLoader({firebaseRef: firebaseTreeLocationsRef, storeSource: treeLocationStoreSource})
//         const sigmaNodes = {}
//         const getSigmaIdsForContentId: fGetSigmaIdsForContentId = () => {
//             return []
//         }
//         const renderedNodes: IHash<ISigmaNode> = {}
//         const allSigmaNodes: IHash<ISigmaNode> = {}
//         const renderedNodesManagerCore: IRenderedNodesManagerCore
//             = new RenderedNodesManagerCore({allSigmaNodes, renderedNodes})
//         const renderedNodesManager: IRenderedNodesManager = new RenderedNodesManager({renderedNodesManagerCore})
//         const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
//         renderedNodesManager.subscribe(sigmaRenderManager)
//         const sigmaNodesUpdater: ISigmaNodesUpdater
//             = new SigmaNodesUpdater({sigmaRenderManager, sigmaNodes, getSigmaIdsForContentId})
//
//         const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
//         // const
//         // DataLoader.start()
//
//         const globalStore: IMutableSubscribableGlobalStore
//             = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)
//         const app: IApp = new App({store: globalStore, UIs: [canvasUI]})
//
//         const treeData = await treeLoader.downloadData(treeIdToDownload)
//
//         const treeLocationData = await treeLocationLoader.downloadData(treeIdToDownload)
//         const childDataPromises = treeData.children.map(treeLoader.downloadData)
//         const childLocationPromises = treeData.children.map(treeLocationLoader.downloadData)
//         await Promise.all(childDataPromises)
//         await Promise.all(childLocationPromises)
//
//         app.start()
//     })
// })
