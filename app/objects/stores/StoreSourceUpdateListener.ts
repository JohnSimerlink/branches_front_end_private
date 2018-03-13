import {inject, injectable} from 'inversify';
import {
    IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore, ISubscribable,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class StoreSourceUpdateListener implements IStoreSourceUpdateListener {
    private storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore;
    constructor(@inject(TYPES.StoreSourceUpdateListenerArgs){storeSourceUpdateListenerCore}: StoreSourceUpdateListenerArgs) {
        this.storeSourceUpdateListenerCore = storeSourceUpdateListenerCore
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate(this.storeSourceUpdateListenerCore.receiveUpdate.bind(this.storeSourceUpdateListenerCore))
    }
}
@injectable()
export class StoreSourceUpdateListenerArgs {
    @inject(TYPES.IStoreSourceUpdateListenerCore) public storeSourceUpdateListenerCore
}
