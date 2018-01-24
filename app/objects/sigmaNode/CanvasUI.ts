// tslint:disable max-classes-per-file
// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {inject, injectable} from 'inversify';
import {ISigmaNodesUpdater, ITypeAndIdAndValUpdates} from '../interfaces';
import {ISubscribable, IUI} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class CanvasUI implements IUI  {
    private sigmaNodesUpdater: ISigmaNodesUpdater

    constructor(@inject(TYPES.CanvasUIArgs){sigmaNodesUpdater}: CanvasUIArgs ) {
        this.sigmaNodesUpdater = sigmaNodesUpdater
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate(this.sigmaNodesUpdater.handleUpdate.bind(this.sigmaNodesUpdater))
    }
}

@injectable()
export class CanvasUIArgs {
    @inject(TYPES.ISigmaNodesUpdater) public sigmaNodesUpdater
}
