// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    ISubscribableTreeLocation, IMutableSubscribablePoint,
    ITreeLocationData,
    IValUpdates,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableTreeLocation extends Subscribable<IValUpdates> implements ISubscribableTreeLocation {
    // TODO: inject the publishing variable via dependency injection into constructor.
    // this could prove useful if we store the objects (with their updatesCallbacks callbacks array) in local storage
    private publishing = false
    public point: IMutableSubscribablePoint

    // TODO: should the below three objects be private?
    public val(): ITreeLocationData {
        return {
            point: this.point.val()
        }
    }
    constructor(@inject(TYPES.SubscribableTreeLocationArgs) {
        updatesCallbacks, point,
    }: SubscribableTreeLocationArgs) {
        super({updatesCallbacks})
        this.point = point
    }
    // TODO: make IValUpdates a generic that takes for example ITreeLocationData
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.point.onUpdate(boundCallCallbacks)
    }
}

@injectable()
export class SubscribableTreeLocationArgs {
    @inject(TYPES.Array) public updatesCallbacks: Array<Function>
    @inject(TYPES.IMutableSubscribablePoint) public point: IMutableSubscribablePoint
}
