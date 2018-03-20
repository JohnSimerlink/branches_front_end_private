// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import * as entries from 'object.entries'; // TODO: why cant i get this working natively with TS es2017?
import {log} from '../../core/log';
import {IDatabaseSaver, IDetailedUpdates} from '../interfaces';
import {TYPES} from '../types';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
if (!Object.entries) {
    entries.shim();
}

export class PropertyFirebaseSaver implements IDatabaseSaver {
    private firebaseRef: Reference;
    constructor(@inject(TYPES.PropertyFirebaseSaverArgs) {firebaseRef}: PropertyFirebaseSaverArgs) {
        this.firebaseRef = firebaseRef;
    }
    public save(updatesObj: IDetailedUpdates) {
        const updates = updatesObj.updates;
        if (updates && Object.keys(updates)) {
            this.firebaseRef.update(updates);
        }
        const pushes = updatesObj.pushes;
        if (!pushes) {
            return;
        }
        for (const [arrayName, pushedValue] of Object.entries(pushes)) {
            this.firebaseRef
                .child(arrayName)
                .push(pushedValue); // TODO: fix violation of Law of Demeter
        }
    }
}
@injectable()
export class PropertyFirebaseSaverArgs {
    @inject(TYPES.String) public firebaseRef: Reference;
}
