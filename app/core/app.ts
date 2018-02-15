import {inject, injectable, tagged} from 'inversify';
import {
    IApp, IMutableSubscribableGlobalStore,
    IUI
} from '../objects/interfaces';
import {TYPES} from '../objects/types';
import {TAGS} from '../objects/tags';
@injectable()
export class App implements IApp {
    private UIs: IUI[]
    private store: IMutableSubscribableGlobalStore
    constructor(@inject(TYPES.AppArgs){UIs, store}: AppArgs ) {
        this.UIs = UIs
        this.store = store
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
    }
}

@injectable()
export class AppArgs {
    @inject(TYPES.Array)
    @tagged(TAGS.DEFAULT_UIS_ARRAY, true)
        public UIs: IUI[]
    @inject(TYPES.IMutableSubscribableGlobalStore) public store: IMutableSubscribableGlobalStore
}
