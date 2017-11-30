// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {ISubscribable} from '../ISubscribable';
import {TYPES} from '../types';
import {IDatabaseSyncer} from './IDatabaseSyncer';
import {IDetailedUpdates} from './IDetailedUpdates';
import {SaveUpdatesToDBFunction} from './ISaveUpdatesToDBFunction';

@injectable()
class SyncToDB implements IDatabaseSyncer {
    private saveUpdatesToDBFunction: SaveUpdatesToDBFunction
    constructor(@inject(TYPES.SyncToDBArgs){saveUpdatesToDBFunction}) {
        this.saveUpdatesToDBFunction = saveUpdatesToDBFunction
    }

    public subscribe(obj: ISubscribable<IDetailedUpdates>) {
        obj.onUpdate(this.saveUpdatesToDBFunction)
    }
}

@injectable()
class SyncToDBArgs {
    @inject(TYPES.SaveUpdatesToDBFunction) public saveUpdatesToDBFunction
}

export {SyncToDB, SyncToDBArgs}
