import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IManagedSigmaNodeCreatorCore, ISigmaNodeCreator,
    ISigmaNodeCreatorCaller, ISubscribable, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class SigmaNodeCreator implements ISigmaNodeCreator {
    private managedSigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore
    constructor(@inject(TYPES.SigmaNodeCreatorArgs){managedSigmaNodeCreatorCore}) {
        this.managedSigmaNodeCreatorCore = managedSigmaNodeCreatorCore
    }
    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        log('SigmaNodeCreator receiveUpdate . . .' + JSON.stringify(update))
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
                this.managedSigmaNodeCreatorCore.receiveNewTreeData({treeId: update.id, treeData: update.val})
                break;
            case ObjectDataTypes.TREE_LOCATION_DATA:
                this.managedSigmaNodeCreatorCore.receiveNewTreeLocationData(
                    {treeId: update.id, treeLocationData: update.val}
                    )
                break;
            default:
                throw new RangeError(JSON.stringify(type) + ' is not a valid update type')
        }
    }
}
@injectable()
export class SigmaNodeCreatorArgs {
    @inject(TYPES.IManagedSigmaNodeCreatorCore) public managedSigmaNodeCreatorCore: IManagedSigmaNodeCreatorCore
}
@injectable()
export class SigmaNodeCreatorCaller implements ISigmaNodeCreatorCaller {
    private sigmaNodeCreator: ISigmaNodeCreator
    constructor(@inject(TYPES.SigmaNodeCreatorCallerArgs){sigmaNodeCreator}) {
        this.sigmaNodeCreator = sigmaNodeCreator
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate(this.sigmaNodeCreator.receiveUpdate)
    }
}
@injectable()
export class SigmaNodeCreatorCallerArgs {
    @inject(TYPES.ISigmaNodeCreator) public sigmaNodeCreator
}
