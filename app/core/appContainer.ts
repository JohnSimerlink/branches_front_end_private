// for now, this is where we will inject all the dependencies
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {
    IApp, IHash, IKnawledgeMapCreator, IMutable, IMutableSubscribableTree, IMutableSubscribableTreeLocation,
    IRenderedNodesManager,
    IRenderedNodesManagerCore, ISigmaNode,
    ISigmaRenderManager, ISubscribableStoreSource, ITreeLoader, ITreeLocationLoader
} from '../objects/interfaces';

import firebase from 'firebase'
import {ISubscribableContentStore} from '../objects/interfaces';
import {ISubscribableContentUserStore} from '../objects/interfaces';
import {IMutableSubscribableGlobalStore} from '../objects/interfaces';
import {
    fGetSigmaIdsForContentId, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    ISigmaNodesUpdater,
    IUI,
} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import {App} from './app';
import BranchesStore from './store2'

import Vue = require('vue');
import VueRouter = require('vue-router');
import {Store} from 'vuex';
import {myContainer} from '../../inversify.config';
import {KnawledgeMapCreator} from '../components/knawledgeMap/knawledgeMap2';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {TYPES} from '../objects/types';
import {INITIAL_ID_TO_DOWNLOAD} from './globals';

class AppContainer {
    constructor() {

    }
    // this should be the only place where I have new statements
    // and I should only have new statements here . . .
    // and one start statement that starts off the initialization/download / logic process
    /* TODO: have an appContainerContainer that does
    const myAppContainer = myContainer.get<IAppContainerContainer>(TYPES.IAppContainerContainer).
     Have that file be put as the root in webpack
     And then have AppContainer have all its objects injected in its args

    */
    public async start() {
        const firebaseTreesRef = firebase.database().ref('trees')
        const firebaseTreeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
        const treeStoreSource: ISubscribableStoreSource<IMutableSubscribableTree>
        = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTree>>(TYPES.ISubscribableStoreSource)
        const treeLocationStoreSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
        = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
            (TYPES.ISubscribableStoreSource)
        const treeLoader: ITreeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
        const treeLocationLoader: ITreeLocationLoader = myContainer.get<ITreeLocationLoader>(TYPES.ITreeLocationLoader)
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
        // const app: IApp = myContainer.get<IApp>(TYPES.IApp)
        const app: IApp = new App({store: globalStore, UIs: [canvasUI]})

        const store: Store<any> = new BranchesStore() as Store<any>
        const knawledgeMapCreator: IKnawledgeMapCreator = new KnawledgeMapCreator({store, treeLoader})
        const knawledgeMap = knawledgeMapCreator.create()
        const routes = [
            { path: '/', component: knawledgeMap, props: true }
        ]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
        const router = new VueRouter({
            routes, // short for `routes: routes`
            mode: 'history',
        })

        const vm = new Vue({
            el: '#branches-app',
            created() {
                return void 0
            },
            data() {
                return {
                }
            },
            computed: {
            },
            methods: {
            },
            store,
            router
        })

        app.start()

        // TODO: don't make the app container container be fetched thorugh dependency injection until we have the UI
        // manually wired and up
        // and running with db saves and everything. Then define the dependency graph inside of the inversify config
    }

}

export {AppContainer}
