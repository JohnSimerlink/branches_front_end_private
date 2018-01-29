// for now, this is where we will inject all the dependencies
import {
    IApp, IContentLoader, IContentUserLoader, IHash, IVueComponentCreator, IMutable, IMutableSubscribableContentStore,
    IMutableSubscribableTreeUserStore, IOneToManyMap,
    IRenderedNodesManager,
    IRenderedNodesManagerCore, ISigma, ISigmaEventListener, ISigmaNode,
    ISigmaRenderManager, ISigmaUpdater, IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore,
    ISubscribableContentStoreSource, ISubscribableContentUserStoreSource,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource, ITooltipOpener,
    ITreeLoader, ITreeLocationLoader, ITreeUserLoader, ITreeComponentCreator2, ITree3Creator, IObjectFirebaseAutoSaver,
    INewTreeComponentCreator, ISigmaNodes, IVueConfigurer
} from '../objects/interfaces';

import {
    ISigmaNodesUpdater,
    IUI,
    ISubscribableTreeUserStoreSource,
} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from '../objects/sigmaNode/SigmaNodesUpdater';
import {App} from './app';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store2'

import Vue from 'vue';
import VueRouter from 'vue-router';
import {Store} from 'vuex';
import {myContainer} from '../../inversify.config';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from '../components/knawledgeMap/knawledgeMap2';
import {RenderedNodesManager} from '../objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore, RenderedNodesManagerCoreArgs} from '../objects/sigmaNode/RenderedNodesManagerCore';
import {TYPES} from '../objects/types';
import {log, error} from './log'
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
import {configureSigma} from '../objects/sigmaNode/configureSigma';
import sigma from '../../other_imports/sigma/sigma.core.js'
import {StoreSourceUpdateListenerCore} from '../objects/stores/StoreSourceUpdateListenerCore';
import {StoreSourceUpdateListener} from '../objects/stores/StoreSourceUpdateListener';
const sigmaAny: any = sigma
import StudyMenu from '../components/studyMenu/studyMenu'
import {Tree2ComponentCreator} from '../components/tree2Component/treeComponent'
import ItemHistory from '../components/itemHistory/itemHistory'
import ProficiencySelector from '../components/proficiencySelector/proficiencySelector'
// import NewTree from ''
import {Tree3Creator} from '../components/tree3Component/tree3Component';
import {NewTreeComponentCreator} from '../components/newTree/newTreeComponentCreator';
import {partialInject} from '../testHelpers/partialInject';
import {inject, injectable} from 'inversify';
import {TAGS} from '../objects/tags';

configureSigma(sigma)

@injectable()
export class AppContainer {
    private contentStoreSource: ISubscribableContentStoreSource
    private contentUserStoreSource: ISubscribableContentUserStoreSource
    private treeStoreSource: ISubscribableTreeStoreSource
    private treeLocationStoreSource: ISubscribableTreeLocationStoreSource
    private treeUserStoreSource: ISubscribableTreeUserStoreSource
    private vueConfigurer: IVueConfigurer
    private store: Store<any>
    private renderedNodesManager: IRenderedNodesManager
    private sigmaRenderManager: ISigmaRenderManager
    constructor(@inject(TYPES.AppContainerArgs){
        contentStoreSource,
        contentUserStoreSource,
        treeStoreSource,
        treeUserStoreSource,
        treeLocationStoreSource,
        vueConfigurer,
        store,
        renderedNodesManager,
        sigmaRenderManager,
   }: AppContainerArgs) {
        this.contentStoreSource = contentStoreSource
        this.contentUserStoreSource = contentUserStoreSource
        this.treeStoreSource = treeStoreSource
        this.treeUserStoreSource = treeUserStoreSource
        this.treeLocationStoreSource = treeLocationStoreSource
        this.vueConfigurer = vueConfigurer
        this.store = store
        this.renderedNodesManager = renderedNodesManager
        this.sigmaRenderManager = sigmaRenderManager
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
        // const sigmaRenderManager: ISigmaRenderManager =
        // myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
        this.renderedNodesManager.subscribe(this.sigmaRenderManager)
        // TODO: << ^^^ this should somehow be handled in ui.start or canvasui.start or something
        const contentIdSigmaIdMap: IOneToManyMap<string>
            // = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap)
            = myContainer.getTagged<IOneToManyMap<string>>(TYPES.IOneToManyMap, TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
        // const me = this
        const refresh = () => this.store.commit(MUTATION_NAMES.REFRESH)
        const sigmaNodesUpdater: ISigmaNodesUpdater
        = partialInject<SigmaNodesUpdaterArgs>({
            konstructor: SigmaNodesUpdater,
            constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
            injections: {
                sigmaRenderManager: this.sigmaRenderManager,
                getSigmaIdsForContentId: contentIdSigmaIdMap.get.bind(contentIdSigmaIdMap),
            },
            container: myContainer,
        })

        const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
            // = new StoreSourceUpdateListenerCore({sigmaNodes, sigmaNodesUpdater, contentIdSigmaIdMap})
            = partialInject<IStoreSourceUpdateListenerCore>({
            konstructor: StoreSourceUpdateListenerCore,
            constructorArgsType: TYPES.IStoreSourceUpdateListenerCore,
            injections: {
                sigmaNodesUpdater,
                contentIdSigmaIdMap,
            },
            container: myContainer,
        })
        const storeSourceUpdateListener: IStoreSourceUpdateListener
            = new StoreSourceUpdateListener({storeSourceUpdateListenerCore})

        storeSourceUpdateListener.subscribe(this.treeStoreSource)
        storeSourceUpdateListener.subscribe(this.treeLocationStoreSource)
        storeSourceUpdateListener.subscribe(this.treeUserStoreSource)
        storeSourceUpdateListener.subscribe(this.contentStoreSource)
        storeSourceUpdateListener.subscribe(this.contentUserStoreSource)

        const canvasUI: IUI = new CanvasUI({sigmaNodesUpdater})
        // const
        // DataLoader.start()

        // const globalStore: IMutableSubscribableGlobalStore
        // = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)
        // const app: IApp = myContainer.get<IApp>(TYPES.IApp)
        const app: IApp =
            // new App({store: globalStore, UIs: [canvasUI]})
        partialInject<IApp>({
            konstructor: App,
            constructorArgsType: TYPES.IApp,
            injections: {
                UIS: [canvasUI]
            },
            container: myContainer,
        })
        app.start()
        this.vueConfigurer.configure()

        // For now, new Vue must be called after app.start()

        // TODO: don't make the app container container be fetched thorugh dependency injection until we have the UI
        // manually wired and up
        // and running with db saves and everything. Then define the dependency graph inside of the inversify config
    }

}

@injectable()
export class AppContainerArgs {
    @inject(TYPES.ISubscribableContentStoreSource) public contentStoreSource: ISubscribableContentStoreSource
    @inject(TYPES.ISubscribableContentUserStoreSource)
        public contentUserStoreSource: ISubscribableContentUserStoreSource
    @inject(TYPES.ISubscribableTreeStoreSource) public treeStoreSource: ISubscribableTreeStoreSource
    @inject(TYPES.ISubscribableTreeUserStoreSource) public treeUserStoreSource: ISubscribableTreeUserStoreSource
    @inject(TYPES.ISubscribableTreeLocationStoreSource)
        public treeLocationStoreSource: ISubscribableTreeLocationStoreSource
    @inject(TYPES.IVueConfigurer)
        public vueConfigurer: IVueConfigurer
    @inject(TYPES.BranchesStore)
        public store: Store<any>
    @inject(TYPES.IRenderedNodesManager) public renderedNodesManager: IRenderedNodesManager
    @inject(TYPES.ISigmaRenderManager) public sigmaRenderManager: ISigmaRenderManager
}
