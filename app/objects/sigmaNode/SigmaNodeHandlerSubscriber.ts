// tslint:disable max-classes-per-file
// map from treeId to sigmaNodeId
// map from contentId to sigmaNodeId
// in the class that creates an instance of SigmaNodeHandlerSubscriber
// subscribe to store. on store update parse object type and id
// and get the correct tree id from either those two properties or from the result of a map lookup

import {inject, injectable} from 'inversify';
import {ISigmaNodeHandler, ITypeAndIdAndValUpdates} from '../interfaces';
import {ISubscribable} from '../subscribable/ISubscribable';
import {ISubscriber} from '../subscribable/ISubscriber';
import {TYPES} from '../types';

@injectable()
class SigmaNodeHandlerSubscriber implements ISubscriber<ITypeAndIdAndValUpdates> {
    private sigmaNodeHandler: ISigmaNodeHandler

    constructor(@inject(TYPES.SigmaNodeHandlerSubscriberArgs){sigmaNodeHandler}) {
        this.sigmaNodeHandler = sigmaNodeHandler
    }
    public subscribe(obj: ISubscribable<ITypeAndIdAndValUpdates>) {
        obj.onUpdate(this.sigmaNodeHandler.handleUpdate)
    }
}

@injectable()
class SigmaNodeHandlerSubscriberArgs {
    @inject(TYPES.ISigmaNodeHandler) public sigmaNodeHandler
}

export {SigmaNodeHandlerSubscriber, SigmaNodeHandlerSubscriberArgs}
