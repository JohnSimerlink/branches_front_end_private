// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {IDatabaseSyncer, IDetailedUpdates, ISaveUpdatesToDBFunction, ISubscribable} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class SyncToDB implements IDatabaseSyncer {
    private saveUpdatesToDBFunction: ISaveUpdatesToDBFunction
    constructor(@inject(TYPES.SyncToDBArgs){saveUpdatesToDBFunction}) {
        this.saveUpdatesToDBFunction = saveUpdatesToDBFunction
    }

    public subscribe(obj: ISubscribable<IDetailedUpdates>) {
        obj.onUpdate(this.saveUpdatesToDBFunction)
    }
}

@injectable()
class SyncToDBArgs {
    @inject(TYPES.ISaveUpdatesToDBFunction) public saveUpdatesToDBFunction
}

export {SyncToDB, SyncToDBArgs}
