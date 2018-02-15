// tslint:disable max-classes-per-file
import 'reflect-metadata'
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {ISubscribable, IUpdatesCallback} from '../interfaces';
import {TYPES} from '../types';

@injectable()
// TODO: make abstract?
export abstract class SubscribableCore<UpdatesType> implements ISubscribable<UpdatesType> {
    private updatesCallbacks: Array<IUpdatesCallback<UpdatesType>>;
    constructor(@inject(TYPES.SubscribableArgs){updatesCallbacks = []}: SubscribableArgs = {updatesCallbacks: []}) {
        this.updatesCallbacks = updatesCallbacks
        // log('subscribable core updates callbacks is ', this.updatesCallbacks)
        /* let updatesCallbacks be injected for
         1) modularity reasons
         2) if we want to cache the state of this entire object, we could load in the previous state
         of set, mutations, and updatesCallbacks easy-peasy
        */
    }
    public onUpdate(func: IUpdatesCallback<UpdatesType>) {
        // log('SubscribableCore onUpdateCalled updatesCallbacks before: called for ',
        //     this.updatesCallbacks, this.updatesCallbacks.length, this, func)
        this.updatesCallbacks.push(func)
        // log('SubscribableCore onUpdateCalled updatesCallbacks after: called for ',
        //     this.updatesCallbacks, this.updatesCallbacks.length, this)
    }
    protected abstract callbackArguments(): UpdatesType

    protected callCallbacks() {
        const me = this
        this.updatesCallbacks.forEach(callback => {
            callback(me.callbackArguments())
        })
    }
}
@injectable()
export class SubscribableArgs {
    @inject(TYPES.Array) public updatesCallbacks;
}
