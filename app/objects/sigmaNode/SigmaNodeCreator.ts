import {inject, injectable} from 'inversify';
import {
    ISigmaNodeCreator, ISigmaNodeCreatorCaller,
    ISigmaNodeCreatorCore, ISubscribable, ISubscriber, ITypeAndIdAndValUpdates,
    ObjectDataTypes
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class SigmaNodeCreator implements ISigmaNodeCreator {
    private sigmaNodeCreatorCore: ISigmaNodeCreatorCore
    constructor(@inject(TYPES.SigmaNodeCreatorArgs){sigmaNodeCreatorCore}) {
        this.sigmaNodeCreatorCore = sigmaNodeCreatorCore
    }
    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
                this.sigmaNodeCreatorCore.receiveNewTreeData({treeId: update.id, treeData: update.val})
                break;
            case ObjectDataTypes.TREE_LOCATION_DATA:
                this.sigmaNodeCreatorCore.receiveNewTreeLocationData({treeId: update.id, treeLocationData: update.val})
                break;
        }
    }
}
@injectable()
export class SigmaNodeCreatorArgs {
    @inject(TYPES.ISigmaNodeCreatorCore) public sigmaNodeCreatorCore: ISigmaNodeCreatorCore
}
@injectable()
export class SigmaNodeCreatorCaller implements ISigmaNodeCreatorCaller {
    private sigmaNodeCreator: ISigmaNodeCreator
    constructor(@inject(TYPES.SigmaNodeCreatorCallerArgs){sigmaNodeCreator}) {
        this.sigmaNodeCreator = sigmaNodeCreator
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate(this.sigmaNodeCreator.receiveUpdate.bind(this.sigmaNodeCreator))
    }
}
@injectable()
export class SigmaNodeCreatorCallerArgs {
    @inject(TYPES.ISigmaNodeCreator) public sigmaNodeCreator
}
