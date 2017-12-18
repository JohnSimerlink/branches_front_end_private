import {inject, injectable} from 'inversify';
import {
    IApp, IMutableSubscribableGlobalStore,
    IUI
} from '../objects/interfaces';
import {TYPES} from '../objects/types';
@injectable()
export class App implements IApp {
    private UIs: IUI[]
    private store: IMutableSubscribableGlobalStore
    constructor(@inject(TYPES.AppArgs){UIs, store}) {
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
    @inject(TYPES.Array) public UIs
    @inject(TYPES.IMutableSubscribableGlobalStore) public store
}
