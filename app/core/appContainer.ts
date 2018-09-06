import {
	IApp,
	IRenderManager,
	ISigmaRenderManager,
	IStoreSourceUpdateListener,
	ISubscribableContentStoreSource,
	ISubscribableContentUserStoreSource,
	ISubscribableTreeLocationStoreSource,
	ISubscribableTreeStoreSource,
	ISubscribableTreeUserStoreSource,
	IVueConfigurer
} from '../objects/interfaces';
import {Store} from 'vuex';
import {TYPES} from '../objects/types';
import {error, log} from './log';
import {inject, injectable, tagged} from 'inversify';
import {TAGS} from '../objects/tags';

@injectable()
export class AppContainer {
	private contentStoreSource: ISubscribableContentStoreSource;
	private contentUserStoreSource: ISubscribableContentUserStoreSource;
	private treeStoreSource: ISubscribableTreeStoreSource;
	private treeLocationStoreSource: ISubscribableTreeLocationStoreSource;
	private treeUserStoreSource: ISubscribableTreeUserStoreSource;
	private vueConfigurer: IVueConfigurer;
	private store: Store<any>;
	private renderManager: IRenderManager;
	private sigmaRenderManager: ISigmaRenderManager;
	private storeSourceUpdateListener: IStoreSourceUpdateListener;
	private app: IApp;

	constructor(@inject(TYPES.AppContainerArgs){
		contentStoreSource,
		contentUserStoreSource,
		treeStoreSource,
		treeUserStoreSource,
		treeLocationStoreSource,
		vueConfigurer,
		store,
		renderManager,
		sigmaRenderManager,
		storeSourceUpdateListener,
		app,
	}: AppContainerArgs) {
		this.contentStoreSource = contentStoreSource;
		this.contentUserStoreSource = contentUserStoreSource;
		this.treeStoreSource = treeStoreSource;
		this.treeUserStoreSource = treeUserStoreSource;
		this.treeLocationStoreSource = treeLocationStoreSource;
		this.vueConfigurer = vueConfigurer;
		this.store = store;
		this.renderManager = renderManager;
		this.sigmaRenderManager = sigmaRenderManager;
		this.storeSourceUpdateListener = storeSourceUpdateListener;
		this.app = app;
	}

	public start() {
		console.log('appContainer start called', Date.now())
		this.renderManager.subscribe(this.sigmaRenderManager);
		// TODO: << ^^^ this should somehow be handled in ui.start or canvasui.start or something

		this.storeSourceUpdateListener.subscribe(this.treeStoreSource);
		this.storeSourceUpdateListener.subscribe(this.treeLocationStoreSource);
		this.storeSourceUpdateListener.subscribe(this.treeUserStoreSource);
		this.storeSourceUpdateListener.subscribe(this.contentStoreSource);
		this.storeSourceUpdateListener.subscribe(this.contentUserStoreSource);

		this.app.start();
		this.vueConfigurer.configure();

		// For now, Vue configure must be called after app.start()
	}

}

@injectable()
export class AppContainerArgs {
	@inject(TYPES.ISubscribableContentStoreSource)
	public contentStoreSource: ISubscribableContentStoreSource;
	@inject(TYPES.ISubscribableContentUserStoreSource)
	public contentUserStoreSource: ISubscribableContentUserStoreSource;
	@inject(TYPES.ISubscribableTreeStoreSource)
	@tagged(TAGS.MAIN_APP, true)
	public treeStoreSource: ISubscribableTreeStoreSource;
	@inject(TYPES.ISubscribableTreeUserStoreSource)
	public treeUserStoreSource: ISubscribableTreeUserStoreSource;
	@inject(TYPES.ISubscribableTreeLocationStoreSource)
	public treeLocationStoreSource: ISubscribableTreeLocationStoreSource;
	@inject(TYPES.IVueConfigurer)
	public vueConfigurer: IVueConfigurer;
	@inject(TYPES.BranchesStore)
	public store: Store<any>;
	@inject(TYPES.IRenderManager)
	public renderManager: IRenderManager;
	@inject(TYPES.ISigmaRenderManager)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaRenderManager: ISigmaRenderManager
	@inject(TYPES.IStoreSourceUpdateListener)
	public storeSourceUpdateListener: IStoreSourceUpdateListener;
	@inject(TYPES.IApp)
	public app: IApp;
}
