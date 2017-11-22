import {ISubscribable, updatesCallback} from '../ISubscribable';
import {Mixin} from '../Mixin';
import {IDatedMutation} from '../mutations/IMutation';
import {Subscribable} from '../tree/Subscribable';
import {IdMutationTypes} from './IdMutationTypes';
import {IMutableId, MutableId} from './MutableId';

@Mixin(Subscribable, MutableId)
class SubscribableMutableId implements ISubscribable,  IMutableId {
    public onUpdate(func: updatesCallback) {return null}
    public get(): string { return null  }
    public addMutation(mutation: IDatedMutation<IdMutationTypes>): void { return null}
    public mutations(): Array<IDatedMutation<IdMutationTypes>> { return null}
    constructor({updatesCallbacks = [], id, mutations = []}) {
        const subscribable = new Subscribable({updatesCallbacks})
        Object.getOwnPropertyNames(subscribable).forEach(prop => {
            this[prop] = subscribable[prop]
        })
        const mutableId = new MutableId({id, mutations})
        Object.getOwnPropertyNames(mutableId).forEach(prop => {
            this[prop] = mutableId[prop]
        })

    }
}
