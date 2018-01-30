// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {IDatabaseAutoSaver, IDetailedUpdates, ISaveUpdatesToDBFunction, ISubscribable} from '../interfaces';
import {TYPES} from '../types';
import {log} from '../../core/log'

@injectable()
export class PropertyAutoFirebaseSaver implements IDatabaseAutoSaver {
    private saveUpdatesToDBFunction: ISaveUpdatesToDBFunction
    constructor(@inject(TYPES.PropertyAutoFirebaseSaverArgs){saveUpdatesToDBFunction}: PropertyAutoFirebaseSaverArgs) {
        this.saveUpdatesToDBFunction = saveUpdatesToDBFunction
    }

    public subscribe(obj: ISubscribable<IDetailedUpdates>) {
        log('PropertyAutoFirebaseSaver called', obj)
        obj.onUpdate(this.saveUpdatesToDBFunction)
    }
}

@injectable()
export class PropertyAutoFirebaseSaverArgs {
    @inject(TYPES.ISaveUpdatesToDBFunction) public saveUpdatesToDBFunction
}
