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

class AppContainer {
    constructor() {

    }
    // this should be the only place where I have new statements
    // and I should only have new statements here . . .
    // and one start statement that starts off the initialization/download / logic process
    public async start() {
        const firebaseTreesRef = firebase.database().ref('trees')
        const firebaseTreeLocationsRef = firebase.database().ref('treeLocations')
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
        const sigmaNodesUpdater: ISigmaNodesUpdater = new SigmaNodesUpdater({sigmaNodes, getSigmaIdsForContentId})
        const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
        // const
        // DataLoader.start()

        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore( {
            store: treeStoreSource,
            updatesCallbacks: []
        })

        const treeUserStore: IMutableSubscribableTreeUserStore = new MutableSubscribableTreeUserStore( {
            store: {},
            updatesCallbacks: []
        })

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore( {
            store: {},
            updatesCallbacks: []
        })

        const contentUserStore: ISubscribableContentUserStore = new SubscribableContentUserStore({
            store: {},
            updatesCallbacks: []
        })

        const contentStore: ISubscribableContentStore = new MutableSubscribableContentStore({
            store: {},
            updatesCallbacks: []
        })

        const globalStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentStore,
                contentUserStore,
                treeStore,
                treeLocationStore,
                treeUserStore,
                updatesCallbacks: [],
            }
        )
        const app: IApp = new App({store: globalStore, UIs: [canvasUI]})

        const treeData = await treeLoader.downloadData(store.state.centeredTreeId)
        await Promise.all( treeData.children.map(treeLoader.downloadData))

        app.start()

    }

}

export {AppContainer}
