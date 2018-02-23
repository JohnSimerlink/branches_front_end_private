import {inject, injectable, tagged} from 'inversify';
import {
    IApp, IAuthListener, IGlobalDataStoreBranchesStoreSyncer, IMutableSubscribableGlobalStore,
    IUI
} from '../objects/interfaces';
import {TYPES} from '../objects/types';
import {TAGS} from '../objects/tags';
@injectable()
export class App implements IApp {
    private UIs: IUI[]
    private store: IMutableSubscribableGlobalStore
    private authListener: IAuthListener
    private globalDataStoreBranchesStoreSyncer: IGlobalDataStoreBranchesStoreSyncer
    constructor(@inject(TYPES.AppArgs){UIs, store, authListener, globalDataStoreBranchesStoreSyncer}: AppArgs ) {
        this.UIs = UIs
        this.store = store
        this.authListener = authListener
        this.globalDataStoreBranchesStoreSyncer = globalDataStoreBranchesStoreSyncer
    }
    public start() {
        // this.stores.loadFromCache() // or // stores.init() or     something
        // ^^^ TODO: << figure out how / when / what data we will load
        const me = this
        this.UIs.forEach(ui => {
            ui.subscribe(me.store)
        })
        // this.shellUI.subscribe(this.stores)
        this.store.startPublishing()

        this.authListener.start()
        this.globalDataStoreBranchesStoreSyncer.start()
    }
}

@injectable()
export class AppArgs {
    @inject(TYPES.Array)
    @tagged(TAGS.DEFAULT_UIS_ARRAY, true)
        public UIs: IUI[]
    @inject(TYPES.IMutableSubscribableGlobalStore) public store: IMutableSubscribableGlobalStore
    @inject(TYPES.IAuthListener) public authListener: IAuthListener
    @inject(TYPES.IGlobalDataStoreBranchesStoreSyncer)
        public globalDataStoreBranchesStoreSyncer: IGlobalDataStoreBranchesStoreSyncer
}
