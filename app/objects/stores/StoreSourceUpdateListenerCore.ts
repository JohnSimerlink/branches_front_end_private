import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    ISigmaNode,
    ISigmaNodesUpdater, IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore, ISubscribable,
    ITypeAndIdAndValUpdates, ObjectDataTypes
} from '../interfaces';
import {SigmaNode, SigmaNodeArgs} from '../sigmaNode/SigmaNode';
import {TYPES} from '../types';

@injectable()
export class StoreSourceUpdateListenerCore implements IStoreSourceUpdateListenerCore {
    private sigmaNodes: object
    private sigmaNodesUpdater: ISigmaNodesUpdater
    constructor(@inject(TYPES.StoreSourceUpdateListenerCoreArgs){sigmaNodes, sigmaNodesUpdater}) {
        this.sigmaNodes = sigmaNodes
        this.sigmaNodesUpdater = sigmaNodesUpdater
    }
    // private receiveUpdate

    public receiveUpdate(update: ITypeAndIdAndValUpdates) {
        log('StoreSourceUpdateListenerCore receiveUpdate CALLED!!!', update)
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
            case ObjectDataTypes.TREE_LOCATION_DATA:
                const sigmaId = update.id
                if (!this.sigmaNodes[sigmaId]) {
                    this.sigmaNodes[sigmaId] = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                }
                this.sigmaNodesUpdater.handleUpdate(update)
                break;
            default:
                throw new RangeError(JSON.stringify(type) + ' is not a valid update type')
        }
    }
}
@injectable()
export class StoreSourceUpdateListenerCoreArgs {
    @inject(TYPES.Object) public sigmaNodes
    @inject(TYPES.ISigmaNodesUpdater) public sigmaNodesUpdater
}
