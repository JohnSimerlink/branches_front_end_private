// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IBranchesMapData,
    ISubscribableBranchesMap,
    IMutableSubscribableField,
    IValUpdates, timestamp, id,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableBranchesMap extends Subscribable<IValUpdates> implements ISubscribableBranchesMap {
    // TODO: dependeny inject the publishing field
    private publishing = false
    public rootTreeId: IMutableSubscribableField<id>;

    constructor(@inject(TYPES.SubscribableBranchesMapArgs) {
        updatesCallbacks,
    }: SubscribableBranchesMapArgs ) {
        super({updatesCallbacks})
    }
    // TODO: should the below three objects be private?
    public val(): IBranchesMapData {
        return {
            rootTreeId: this.rootTreeId.val(),
        }
    }
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.rootTreeId.onUpdate(boundCallCallbacks)
    }
}

@injectable()
export class SubscribableBranchesMapArgs {
    @inject(TYPES.Array) public updatesCallbacks: any[]
    @inject(TYPES.IMutableSubscribableNumber) public rootTreeId: IMutableSubscribableField<id>
}
