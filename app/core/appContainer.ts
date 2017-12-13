// for now, this is where we will inject all the dependencies
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {
    IApp, IHash, IMutable, IMutableSubscribableTree, IMutableSubscribableTreeLocation, IRenderedNodesManager,
    IRenderedNodesManagerCore, ISigmaNode,
    ISigmaRenderManager, ISubscribableStoreSource
} from '../objects/interfaces';

import {ISubscribableContentStore} from '../objects/interfaces';
import {
    fGetSigmaIdsForContentId, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUserStore,
    ISigmaNodesUpdater,
    IUI,
} from '../objects/interfaces';
import {ISubscribableContentUserStore} from '../objects/interfaces';
import {IMutableSubscribableGlobalStore} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {SubscribableContentUserStore} from '../objects/stores/contentUser/SubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {App} from './app';
import store from './store2'
import firebase from 'firebase'

import {myContainer} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {SigmaRenderManager} from '../objects/sigmaNode/SigmaRenderManager';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {FIREBASE_PATHS} from '../loaders/paths';

class AppContainer {
    constructor() {

    }
    // this should be the only place where I have new statements
    // and I should only have new statements here . . .
    // and one start statement that starts off the initialization/download / logic process
    public async start() {
        const firebaseTreesRef = firebase.database().ref('trees')
        const firebaseTreeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
        const treeStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
        = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLocationStoreSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
        = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
            (TYPES.ISubscribableStoreSource)
        const treeLoader = new TreeLoader({firebaseRef: firebaseTreesRef, storeSource: treeStoreSource})
        const treeLocationLoader
            = new TreeLocationLoader({firebaseRef: firebaseTreeLocationsRef, storeSource: treeLocationStoreSource})
        const sigmaNodes = {}
        const getSigmaIdsForContentId: fGetSigmaIdsForContentId = () => {
            return []
        }
        const renderedNodes: IHash<ISigmaNode> = {}
        const allSigmaNodes: IHash<ISigmaNode> = {}
        const renderedNodesManagerCore: IRenderedNodesManagerCore
        = new RenderedNodesManagerCore({allSigmaNodes, renderedNodes})
        const renderedNodesManager: IRenderedNodesManager = new RenderedNodesManager({renderedNodesManagerCore})
        const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        renderedNodesManager.subscribe(sigmaRenderManager)
        const sigmaNodesUpdater: ISigmaNodesUpdater
        = new SigmaNodesUpdater({sigmaRenderManager, sigmaNodes, getSigmaIdsForContentId})

        const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
        // const
        // DataLoader.start()

        const globalStore: IMutableSubscribableGlobalStore
        = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)
        const app: IApp = new App({store: globalStore, UIs: [canvasUI]})

        const treeData = await treeLoader.downloadData(store.state.centeredTreeId)

        const treeLocationData = await treeLocationLoader.downloadData(store.state.centeredTreeId)
        const childDataPromises = treeData.children.map(treeLoader.downloadData)
        const childLocationPromises = treeData.children.map(treeLocationLoader.downloadData)
        await Promise.all(childDataPromises)
        await Promise.all(childLocationPromises)

        app.start()

    }

}

export {AppContainer}
