import {inject, injectable} from 'inversify';
import {IApp, IMutableSubscribableGlobalStore, ISigmaNodeHandlerSubscriber} from '../objects/interfaces';
import {TYPES} from '../objects/types';
@injectable()
class App implements IApp {
    private canvasUI: ISigmaNodeHandlerSubscriber // TODO: replace with an interface and/or generic
    /* TODO: rather than hardcoding all the types of UIs that subscribe to the app,
     let the app invocation or inversify object graph dynamically choose which UIs should be part of the app
     */
    private store: IMutableSubscribableGlobalStore
    constructor(@inject(TYPES.AppArgs){sigmaNodeHandlerSubscriber, store}) {
        this.canvasUI = sigmaNodeHandlerSubscriber
        this.store = store
    }
    public start() {
        // this.stores.loadFromCache() // or // stores.init() or     something
        // ^^^ TODO: << figure out how / when / what data we will load
        this.canvasUI.subscribe(this.store)
        // this.shellUI.subscribe(this.stores)
        this.store.startPublishing()
    }
}

@injectable()
class AppArgs {
    @inject(TYPES.ISigmaNodeHandlerSubscriber) public sigmaNodeHandlerSubscriber
    @inject(TYPES.IMutableSubscribableGlobalStore) public store
}
export {App, AppArgs}
