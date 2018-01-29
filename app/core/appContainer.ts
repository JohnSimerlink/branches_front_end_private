import {
    IApp,
    IRenderedNodesManager,
    ISigmaRenderManager, IStoreSourceUpdateListener,
    ISubscribableContentStoreSource, ISubscribableContentUserStoreSource,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource,
    IVueConfigurer
} from '../objects/interfaces';

import {
    IUI,
    ISubscribableTreeUserStoreSource,
} from '../objects/interfaces';
import {CanvasUI} from '../objects/sigmaNode/CanvasUI';
import {App} from './app';
import {Store} from 'vuex';
import {myContainer} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {log, error} from './log'
import {configureSigma} from '../objects/sigmaNode/configureSigma';
import sigma from '../../other_imports/sigma/sigma.core.js'
import {partialInject} from '../testHelpers/partialInject';
import {inject, injectable, tagged} from 'inversify';
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
    private storeSourceUpdateListener: IStoreSourceUpdateListener
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
        storeSourceUpdateListener,
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
        this.storeSourceUpdateListener = storeSourceUpdateListener
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
        this.renderedNodesManager.subscribe(this.sigmaRenderManager)
        // TODO: << ^^^ this should somehow be handled in ui.start or canvasui.start or something

        this.storeSourceUpdateListener.subscribe(this.treeStoreSource)
        this.storeSourceUpdateListener.subscribe(this.treeLocationStoreSource)
        this.storeSourceUpdateListener.subscribe(this.treeUserStoreSource)
        this.storeSourceUpdateListener.subscribe(this.contentStoreSource)
        this.storeSourceUpdateListener.subscribe(this.contentUserStoreSource)

        const canvasUI: IUI =
            myContainer.get<CanvasUI>(TYPES.CanvasUI)
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
    @inject(TYPES.ISigmaRenderManager)
    @tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
        public sigmaRenderManager: ISigmaRenderManager
    @inject(TYPES.IStoreSourceUpdateListener)
        public storeSourceUpdateListener: IStoreSourceUpdateListener
}
