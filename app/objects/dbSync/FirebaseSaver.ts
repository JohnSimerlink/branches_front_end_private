// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries' // TODO: why cant i get this working natively with TS es2017?
import {log} from  '../../core/log'
import {TYPES} from '../types';
import {IDatabaseSaver} from './IDatabaseSaver';
import {IDetailedUpdates} from './IDetailedUpdates';
import {IFirebaseRef} from './IFirebaseRef';
if (!Object.entries) {
    entries.shim()
}

class FirebaseSaver implements IDatabaseSaver {
    private firebaseRef: IFirebaseRef
    constructor(@inject(TYPES.FirebaseSaverArgs) {firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    public save(updatesObj: IDetailedUpdates) {
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
class FirebaseSaverArgs {
    @inject(TYPES.String) public firebaseRef
}
export {FirebaseSaver, FirebaseSaverArgs}
