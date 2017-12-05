import {inject, injectable} from 'inversify';
import {
    IApp, IMutableSubscribableGlobalStore, ICanvasUI, ISubscriber,
    ITypeAndIdAndValUpdates, IUI
} from '../objects/interfaces';
import {TYPES} from '../objects/types';
@injectable()
class App implements IApp {
    private UIs: IUI[] // TODO: replace with an interface and/or generic
    /* TODO: rather than hardcoding all the types of UIs that subscribe to the app,
     let the app invocation or inversify object graph dynamically choose which UIs should be part of the app
     */
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
class AppArgs {
    @inject(TYPES.ISubscriber_ITypeAndIdAndValUpdates_Array) public UIs
    @inject(TYPES.IMutableSubscribableGlobalStore) public store
}
export {App, AppArgs}
