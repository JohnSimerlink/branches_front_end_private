// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatedMutation, ISubscribable} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableCore} from './SubscribableCore';

@injectable()
class Subscribable<UpdatesType>
    extends SubscribableCore<UpdatesType>
    implements ISubscribable<UpdatesType> {
    protected updates: {val?: object} = {}
    protected pushes: {} = {}
    constructor(@inject(TYPES.SubscribableArgs){updatesCallbacks = []} = {updatesCallbacks: []}) {
        super({updatesCallbacks})
    }
    protected callbackArguments(): UpdatesType {
        return {
            pushes: this.pushes,
            updates: this.updates
        } as any // TODO: figure out how to remove this cast
    }
    protected callCallbacks() {
        super.callCallbacks()
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
