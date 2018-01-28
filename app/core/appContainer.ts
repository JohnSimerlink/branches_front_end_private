// for now, this is where we will inject all the dependencies
import {TreeLoader, TreeLoaderArgs} from '../loaders/tree/TreeLoader';
import {
    IApp, IContentLoader, IContentUserLoader, IHash, IVueComponentCreator, IMutable, IMutableSubscribableContentStore,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableTreeUserStore, IOneToManyMap,
    IRenderedNodesManager,
    IRenderedNodesManagerCore, ISigma, ISigmaEventListener, ISigmaNode,
    ISigmaRenderManager, ISigmaUpdater, IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore,
    ISubscribableContentStoreSource, ISubscribableContentUserStoreSource,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ITooltipOpener,
    ITreeLoader, ITreeLocationLoader, ITreeUserLoader, ITreeComponentCreator2, ITree3Creator, IObjectFirebaseAutoSaver,
    INewTreeComponentCreator
} from '../objects/interfaces';

import firebase from 'firebase'
import {IMutableSubscribableGlobalStore} from '../objects/interfaces';
import {
    fGetSigmaIdsForContentId, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    ISigmaNodesUpdater,
    IUI,
    ISubscribableTreeUserStoreSource,
} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import {App} from './app';
import BranchesStore, {MUTATION_NAMES} from './store2'

import Vue from 'vue';
import VueRouter from 'vue-router';
import {Store} from 'vuex';
import {myContainer} from '../../inversify.config';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from '../components/knawledgeMap/knawledgeMap2';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLocationLoader, TreeLocationLoaderArgs} from '../loaders/treeLocation/TreeLocationLoader';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {TYPES} from '../objects/types';
import {INITIAL_ID_TO_DOWNLOAD, JOHN_USER_ID} from './globals';
import {log, error} from './log'
import studyMenu from '../components/studyMenu/studyMenu'
import BranchesFooter from '../components/footer/branchesFooter'
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
// import GraphData = SigmaJs.GraphData;
import {configureSigma} from '../objects/sigmaNode/configureSigma';
// import Sigma = SigmaJs.Sigma;
// import {SigmaJs} from 'sigmajs';
import sigma from '../../other_imports/sigma/sigma.core.js'
import {StoreSourceUpdateListenerCore} from '../objects/stores/StoreSourceUpdateListenerCore';
import {StoreSourceUpdateListener} from '../objects/stores/StoreSourceUpdateListener';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeUserStore} from '../objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {MutableSubscribableContentUser} from '../objects/contentUser/MutableSubscribableContentUser';
import {MutableSubscribableContentUserStore} from '../objects/stores/contentUser/MutableSubscribableContentUserStore';
import {TreeUserLoader} from '../loaders/treeUser/TreeUserLoader';
import {ContentLoader, ContentLoaderArgs} from '../loaders/content/ContentLoader';
const sigmaAny: any = sigma
import clonedeep from 'lodash.clonedeep'
import {SigmaEventListener} from '../objects/sigmaEventListener/sigmaEventListener';
import {TooltipOpener} from '../objects/tooltipOpener/tooltipOpener';
import {ContentUserLoader, ContentUserLoaderArgs} from '../loaders/contentUser/ContentUserLoader';
import StudyMenu from '../components/studyMenu/studyMenu'
import {Tree2ComponentCreator} from '../components/tree2Component/treeComponent'
import ItemHistory from '../components/itemHistory/itemHistory'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
// import NewTree from ''
import {Tree3Creator} from '../components/tree3Component/tree3Component';
import {SpecialTreeLoader, SpecialTreeLoaderArgs} from '../loaders/tree/specialTreeLoader';
import {
    AutoSaveMutableSubscribableContentUserStore,
    AutoSaveMutableSubscribableContentUserStoreArgs
} from '../objects/stores/contentUser/AutoSaveMutableSubscribableContentUserStore';
import {
    ContentUserLoaderAndAutoSaver,
    ContentUserLoaderAndAutoSaverArgs
} from '../loaders/contentUser/ContentUserLoaderAndAutoSaver';
import {ObjectFirebaseAutoSaver} from '../objects/dbSync/ObjectAutoFirebaseSaver';
import {NewTreeComponentCreator} from '../components/newTree/newTreeComponentCreator';
import {ContentLoaderAndAutoSaver, ContentLoaderAndAutoSaverArgs} from '../loaders/content/ContentLoaderAndAutoSaver';
import {TreeLoaderAndAutoSaver, TreeLoaderAndAutoSaverArgs} from '../loaders/tree/TreeLoaderAndAutoSaver';
import {
    TreeLocationLoaderAndAutoSaver,
    TreeLocationLoaderAndAutoSaverArgs
} from '../loaders/treeLocation/TreeLocationLoaderAndAutoSaver';
import {
    AutoSaveMutableSubscribableContentStore,
    AutoSaveMutableSubscribableContentStoreArgs
} from '../objects/stores/content/AutoSaveMutableSubscribableContentStore';
import {
    AutoSaveMutableSubscribableTreeLocationStore,
    AutoSaveMutableSubscribableTreeLocationStoreArgs
} from '../objects/stores/treeLocation/AutoSaveMutableSubscribableTreeLocationStore';
import {
    AutoSaveMutableSubscribableTreeUserStore,
    AutoSaveMutableSubscribableTreeUserStoreArgs
} from '../objects/stores/treeUser/AutoSaveMutableSubscribableTreeUserStore';
import {AutoSaveMutableSubscribableTreeStore, AutoSaveMutableSubscribableTreeStoreArgs} from '../objects/stores/tree/AutoSaveMutableSubscribableTreeStore';
import {partialInject} from '../testHelpers/partialInject';

configureSigma(sigma)

Vue.component('branchesFooter', BranchesFooter)
export class AppContainer {
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

        // const firebaseContentRef = firebase.database().ref(FIREBASE_PATHS.CONTENT)
        // const firebaseContentUsersRef = firebase.database().ref(FIREBASE_PATHS.CONTENT_USERS)
        // const firebaseTreesRef = firebase.database().ref(FIREBASE_PATHS.TREES)
        // const firebaseTreeUsersRef = firebase.database().ref(FIREBASE_PATHS.TREE_USERS)
        // const firebaseTreeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
        const contentStoreSource: ISubscribableContentStoreSource
            = myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
        const contentUserStoreSource: ISubscribableContentUserStoreSource
            = myContainer.get<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
        const treeStoreSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
        const treeUserStoreSource: ISubscribableTreeUserStoreSource
            = myContainer.get<ISubscribableTreeUserStoreSource>
        (TYPES.ISubscribableTreeUserStoreSource)
        const treeLocationStoreSource: ISubscribableTreeLocationStoreSource
        = myContainer.get<ISubscribableTreeLocationStoreSource>
            (TYPES.ISubscribableTreeLocationStoreSource)

        // const treeStore: IMutableSubscribableTreeStore =
        //     partialInject<AutoSaveMutableSubscribableTreeStoreArgs>( {
        //         konstructor: AutoSaveMutableSubscribableTreeStore,
        //         constructorArgsType: TYPES.AutoSaveMutableSubscribableTreeStoreArgs,
        //         injections: {
        //             // storeSource: treeStoreSource,
        //         },
        //         container: myContainer,
        //     })

        // const treeUserStore: IMutableSubscribableTreeUserStore =
        //     partialInject<AutoSaveMutableSubscribableTreeUserStoreArgs>( {
        //         konstructor: AutoSaveMutableSubscribableTreeUserStore,
        //         constructorArgsType: TYPES.AutoSaveMutableSubscribableTreeUserStoreArgs,
        //         injections: {
        //             // storeSource: treeUserStoreSource,
        //         },
        //         container: myContainer,
        //     })

        // const treeLocationStore: IMutableSubscribableTreeLocationStore =
        //     partialInject<AutoSaveMutableSubscribableTreeLocationStoreArgs>({
        //         konstructor: AutoSaveMutableSubscribableTreeLocationStore,
        //         constructorArgsType: TYPES.AutoSaveMutableSubscribableTreeLocationStoreArgs,
        //         injections: {
        //             // storeSource: treeLocationStoreSource
        //         },
        //         container: myContainer
        //     })

        // const contentStore: IMutableSubscribableContentStore =
        //     partialInject<AutoSaveMutableSubscribableContentStoreArgs>({
        //         konstructor: AutoSaveMutableSubscribableContentStore,
        //         constructorArgsType: TYPES.AutoSaveMutableSubscribableContentStoreArgs,
        //         injections: {
        //             // storeSource: contentStoreSource
        //         },
        //         container: myContainer
        //     })

        // const contentUserStore: IMutableSubscribableContentUserStore =
        //     partialInject<AutoSaveMutableSubscribableContentUserStoreArgs>({
        //         konstructor: AutoSaveMutableSubscribableContentUserStore,
        //         constructorArgsType: TYPES.AutoSaveMutableSubscribableContentUserStoreArgs,
        //         injections: {
        //             // storeSource: contentUserStoreSource
        //         },
        //         container: myContainer,
        //     })

        log('appContainer 190, MutableSubscribableGlobalStore about to be created')
        const globalStore: IMutableSubscribableGlobalStore =
            myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)
        log('appContainer 193, MutableSubscribableGlobalStore just created', globalStore['_globalStoreId'])
            // new MutableSubscribableGlobalStore(
            //     {updatesCallbacks: [], contentUserStore, treeStore, treeLocationStore, treeUserStore, contentStore})

        const state: object = myContainer.get<object>(TYPES.BranchesStoreState)
        const store: Store<any> = new BranchesStore({globalDataStore: globalStore, state}) as Store<any>

        const sigmaUpdater: ISigmaUpdater =
            new SigmaUpdater({
                store
            })
        const sigmaNodes: IHash<ISigmaNode> = {}
        const renderedNodesManagerCore: IRenderedNodesManagerCore
        = new RenderedNodesManagerCore({sigmaNodes, addNodeToSigma: sigmaUpdater.addNode.bind(sigmaUpdater)})
        const renderedNodesManager: IRenderedNodesManager = new RenderedNodesManager({renderedNodesManagerCore})
        const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        renderedNodesManager.subscribe(sigmaRenderManager)
        // TODO: << ^^^ this should somehow be handled in ui.start or canvasui.start or something
        const contentIdSigmaIdMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap)
        function refresh() {
            store.commit(MUTATION_NAMES.REFRESH)
        }
        const sigmaNodesUpdater: ISigmaNodesUpdater
        = new SigmaNodesUpdater(
            {
                sigmaRenderManager,
                sigmaNodes,
                getSigmaIdsForContentId: contentIdSigmaIdMap.get.bind(contentIdSigmaIdMap),
                refresh,
                contentIdContentMap: {},
            })

        const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
            = new StoreSourceUpdateListenerCore({sigmaNodes, sigmaNodesUpdater, contentIdSigmaIdMap})
        const storeSourceUpdateListener: IStoreSourceUpdateListener
            = new StoreSourceUpdateListener({storeSourceUpdateListenerCore})

        storeSourceUpdateListener.subscribe(treeStoreSource)
        storeSourceUpdateListener.subscribe(treeLocationStoreSource)
        storeSourceUpdateListener.subscribe(treeUserStoreSource)
        storeSourceUpdateListener.subscribe(contentStoreSource)
        storeSourceUpdateListener.subscribe(contentUserStoreSource)

        const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
        // const
        // DataLoader.start()

        // const globalStore: IMutableSubscribableGlobalStore
        // = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)
        // const app: IApp = myContainer.get<IApp>(TYPES.IApp)
        const app: IApp = new App({store: globalStore, UIs: [canvasUI]})
        // const userId = JOHN_USER_ID // 'abc1234'

        const treeComponentCreator: ITree3Creator =
            new Tree3Creator({store})
        const Tree = treeComponentCreator.create()
        const newTreeComponentCreator: INewTreeComponentCreator =
            new NewTreeComponentCreator({store})
        const NewTree = newTreeComponentCreator.create()

        log('appContainer 253, MutableSubscribableGlobalStore has been called yet?')
        Vue.component('tree', Tree)

        Vue.component('studyMenu', StudyMenu)
        Vue.component('itemHistory', ItemHistory)
        Vue.component('proficiencySelector', ProficiencySelector)
        Vue.component('newtree', NewTree)

        log('appContainer 261, MutableSubscribableGlobalStore has been called yet?')

        const knawledgeMapCreator: IVueComponentCreator =
            // new KnawledgeMapCreator({
            //         store,
            //         specialTreeLoader: treeLoaderAndAutoSaver,
            //         treeLocationLoader: treeLocationLoaderAndAutoSaver,
            //         contentLoader: contentLoaderAndAutoSaver,
            //         contentUserLoader: contentUserLoaderAndAutoSaver,
            //         userId
            //     })
        partialInject<KnawledgeMapCreatorArgs>({
            konstructor: KnawledgeMapCreator,
            constructorArgsType: TYPES.KnawledgeMapCreatorArgs,
            injections: {
                store,
                // specialTreeLoader: treeLoaderAndAutoSaver,
            },
            container: myContainer
        })
        log('appContainer 280, has MutableSubscribableGlobalStore constructor been called yet?')

        const KnawledgeMap = knawledgeMapCreator.create()
        const routes = [
            { path: '/', component: KnawledgeMap, props: true }
        ]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
        const router = new VueRouter({
            routes, // short for `routes: routes`
            mode: 'history',
        })
        const treeIdToDownload = 1
        app.start()

        // For now, new Vue must be called after app.start()
        const vm = new Vue({
            el: '#branches-app',
            created() {
                // log('Vue instance created')
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

        // TODO: don't make the app container container be fetched thorugh dependency injection until we have the UI
        // manually wired and up
        // and running with db saves and everything. Then define the dependency graph inside of the inversify config
    }

}
