import {inject, injectable} from 'inversify';
import {ISubscribableGlobalDataStore} from '../objects/dataStores/SubscribableGlobalDataStore';
import {IApp, ISigmaNodeHandlerSubscriber} from '../objects/interfaces';
import {TYPES} from '../objects/types';
@injectable()
class App implements IApp {
    private canvasUI: ISigmaNodeHandlerSubscriber // TODO: replace with an interface and/or generic
    private dataChangeEmitter: ISubscribableGlobalDataStore
    constructor(@inject(TYPES.AppArgs){sigmaNodeHandlerSubscriber, subscribableGlobalDataStore}) {
        this.canvasUI = sigmaNodeHandlerSubscriber
        this.dataChangeEmitter = subscribableGlobalDataStore
    }
    public start() {
        // this.dataChangeEmitter.loadFromCache() // or // dataChangeEmitter.init() or     something
        // ^^^ TODO: << figure out how / when / what data we will load
        this.canvasUI.subscribe(this.dataChangeEmitter)
        // this.shellUI.subscribe(this.dataChangeEmitter)
        this.dataChangeEmitter.startBroadcasting()
    }
}

@injectable()
class AppArgs {
    @inject(TYPES.ISigmaNodeHandlerSubscriber) public sigmaNodeHandlerSubscriber
}
export {App, AppArgs}
