import {inject, injectable} from 'inversify';
import {IApp, IMutableSubscribableGlobalDataStore, ISigmaNodeHandlerSubscriber} from '../objects/interfaces';
import {TYPES} from '../objects/types';
@injectable()
class App implements IApp {
    private canvasUI: ISigmaNodeHandlerSubscriber // TODO: replace with an interface and/or generic
    /* TODO: rather than hardcoding all the types of UIs that subscribe to the app,
     let the app invocation or inversify object graph dynamically choose which UIs should be part of the app
     */
    private dataStore: IMutableSubscribableGlobalDataStore
    constructor(@inject(TYPES.AppArgs){sigmaNodeHandlerSubscriber, dataStore}) {
        this.canvasUI = sigmaNodeHandlerSubscriber
        this.dataStore = dataStore
    }
    public start() {
        // this.dataStore.loadFromCache() // or // dataStore.init() or     something
        // ^^^ TODO: << figure out how / when / what data we will load
        this.canvasUI.subscribe(this.dataStore)
        // this.shellUI.subscribe(this.dataStore)
        this.dataStore.startBroadcasting()
    }
}

@injectable()
class AppArgs {
    @inject(TYPES.ISigmaNodeHandlerSubscriber) public sigmaNodeHandlerSubscriber
    @inject(TYPES.IMutableSubscribableGlobalDataStore) public dataStore
}
export {App, AppArgs}
