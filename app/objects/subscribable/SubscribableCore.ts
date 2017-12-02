// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {ISubscribable, updatesCallback} from '../interfaces';
import {TYPES} from '../types';

@injectable()
// TODO: make abstract?
abstract class SubscribableCore<UpdatesType> implements ISubscribable<UpdatesType> {
    private updatesCallbacks: Array<updatesCallback<UpdatesType>>;
    constructor(@inject(TYPES.SubscribableArgs){updatesCallbacks = []} = {updatesCallbacks: []}) {
        this.updatesCallbacks = updatesCallbacks
        // log('subscribable core updates callbacks is ', this.updatesCallbacks)
        /* let updatesCallbacks be injected for
         1) modularity reasons
         2) if we want to cache the state of this entire object, we could load in the previous state
         of set, mutations, and updatesCallbacks easy-peasy
        */
    }
    public onUpdate(func: updatesCallback<UpdatesType>) {
        this.updatesCallbacks.push(func)
    }
    protected abstract callbackArguments()

    protected callCallbacks() {
        const me = this
        this.updatesCallbacks.forEach(callback => {
            callback(me.callbackArguments())
        })
    }
}
@injectable()
class SubscribableArgs {
    @inject(TYPES.Array) public updatesCallbacks;
}
export {SubscribableCore, SubscribableArgs}
