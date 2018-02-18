// tslint:disable max-classes-per-file
// sourceMap from treeId to sigmaNodeId
// sourceMap from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a sourceMap lookup

import {inject, injectable, tagged} from 'inversify';
import {ISigmaNodesUpdater, ITypeAndIdAndValUpdates} from '../interfaces';
import {ISubscribable, IUI} from '../interfaces';
import {TYPES} from '../types';
import {TAGS} from '../tags';

@injectable()
export class CanvasUI implements IUI  {
    private sigmaNodesUpdater: ISigmaNodesUpdater

    constructor(@inject(TYPES.CanvasUIArgs){sigmaNodesUpdater}: CanvasUIArgs ) {
        this.sigmaNodesUpdater = sigmaNodesUpdater
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        const handleUpdate = this.sigmaNodesUpdater.handleUpdate.bind(this.sigmaNodesUpdater)
        obj.onUpdate(handleUpdate)
    }
}

@injectable()
export class CanvasUIArgs {
    @inject(TYPES.ISigmaNodesUpdater)
    @tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
        public sigmaNodesUpdater
}
