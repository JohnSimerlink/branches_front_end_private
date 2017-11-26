// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {ISubscribable} from '../ISubscribable';
import {ISubscriber} from '../ISubscriber';
import {TYPES} from '../types';
import {IDatabaseSyncer} from './IDatabaseSyncer';
import {IFirebaseRef} from './IFirebaseRef';
import {SaveUpdatesToDBFunction} from './ISaveUpdatesToDBFunction';
import {IUpdates} from './IUpdates';

@injectable()
class SyncToDB implements IDatabaseSyncer {
    private saveUpdatesToDBFunction: SaveUpdatesToDBFunction
    constructor(@inject(TYPES.SyncToFirebaseArgs){saveUpdatesToDBFunction}) {
        this.saveUpdatesToDBFunction = saveUpdatesToDBFunction
    }

    public subscribe(obj: ISubscribable) {
        obj.onUpdate(this.saveUpdatesToDBFunction)
    }
}

@injectable()
class SyncToDBArgs {
    @inject(TYPES.SaveUpdatesToDBFunction) public saveUpdatesToDBFunction
}

export {SyncToDB, SyncToDBArgs}
