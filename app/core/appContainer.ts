// for now, this is where we will inject all the dependencies
import {TreeLoader} from '../loaders/treeLoader';
import {IApp} from '../objects/interfaces';
import {ISubscribableContentStore} from '../objects/interfaces';
import {
    fGetSigmaIdsForContentId, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUserStore,
    ISigmaNodeHandler,
    IUI,
} from '../objects/interfaces';
import {ISubscribableContentUserStore} from '../objects/interfaces';
import {IMutableSubscribableGlobalStore} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodeHandler} from '../objects/sigmaNode/SigmaNodeHandler';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {SubscribableContentUserStore} from '../objects/stores/contentUser/SubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {App} from './app';
import store from './store2'
import firebase from 'firebase'

class AppContainer {
    constructor() {

    }
    // this should be the only place where I have new statements
    // and I should only have new statements here . . .
    // and one start statement that starts off the initialization/download / logic process
    public async start() {
        const firebaseTreesRef = firebase.database().ref('trees')
        const treeStoreSource = {}
        const treeLoader = new TreeLoader({firebaseRef: firebaseTreesRef, store: treeStoreSource})

        const sigmaNodes = {}
        const getSigmaIdsForContentId: fGetSigmaIdsForContentId = () => {
            return []
        }
        const sigmaNodeHandler: ISigmaNodeHandler = new SigmaNodeHandler({sigmaNodes, getSigmaIdsForContentId})
        const canvasUI: IUI = new CanvasUI({sigmaNodeHandler})
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
