// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {ISubscribable, updatesCallback} from '../ISubscribable';
import {IDatedMutation} from '../mutations/IMutation';
import {SetMutationTypes} from '../set/SetMutationTypes';
import {TYPES} from '../types';

@injectable()
    // TODO: make abstract?
class Subscribable<MutationTypes> implements ISubscribable {
    protected updates: {val?: object} = {}
    protected pushes: {mutations?: IDatedMutation<MutationTypes>} = {}
    private updatesCallbacks: updatesCallback[];
    constructor(@inject(TYPES.SubscribableArgs){updatesCallbacks} = {updatesCallbacks: []}) {
        this.updatesCallbacks = updatesCallbacks /* let updatesCallbacks be injected for
         1) modularity reasons
         2) if we want to cache the state of this entire object, we could load in the previous state
         of set, mutations, and updatesCallbacks easy-peasy
         */
    }
    public onUpdate(func: updatesCallback) {
        this.updatesCallbacks.push(func)
    }
    protected callCallbacks() {
        const me = this
        this.updatesCallbacks.forEach(callback => {
            callback({
                pushes: me.pushes,
                updates: me.updates,
            })
        })
        this.clearPushesAndUpdates()
    }
    private clearPushesAndUpdates() {
        this.updates = {}
        this.pushes = {}
    }
}
@injectable()
class SubscribableArgs {
    @inject(TYPES.Array) public updatesCallbacks;
}
export {Subscribable, SubscribableArgs}
