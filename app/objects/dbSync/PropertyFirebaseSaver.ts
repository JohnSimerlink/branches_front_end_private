// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {log} from '../../core/log'
import {IDatabaseSaver, IDetailedUpdates, IFirebaseRef} from '../interfaces';
import {TYPES} from '../types';
if (!Object.entries) {
    entries.shim()
}

export class PropertyFirebaseSaver implements IDatabaseSaver {
    private firebaseRef: IFirebaseRef
    constructor(@inject(TYPES.PropertyFirebaseSaverArgs) {firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    public save(updatesObj: IDetailedUpdates) {
        log('property firebase saver called', updatesObj, this.firebaseRef)
        const updates = updatesObj.updates
        if (updates && Object.keys(updates)) {
            this.firebaseRef.update(updates)
        }
        const pushes = updatesObj.pushes
        if (!pushes) {
            return
        }
        for (const [arrayName, pushedValue] of Object.entries(pushes)) {
            this.firebaseRef
                .child(arrayName)
                .push(pushedValue) // TODO: fix violation of Law of Demeter
        }
    }
}
@injectable()
export class PropertyFirebaseSaverArgs {
    @inject(TYPES.String) public firebaseRef
}
