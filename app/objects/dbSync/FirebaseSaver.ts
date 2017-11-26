// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {IDatabaseSaver} from './IDatabaseSaver';
import {IFirebaseRef} from './IFirebaseRef';
import {IUpdates} from './IUpdates';

class FirebaseSaver implements IDatabaseSaver {
    private firebaseRef: IFirebaseRef
    constructor(@inject(TYPES.FirebaseSaverArgs) {firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    public save(updatesObj: IUpdates) {
        const updates = updatesObj.updates
        if (updates && Object.keys(updates)) {
            this.firebaseRef.update(updates)
        }
        const pushes = updatesObj.pushes
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
