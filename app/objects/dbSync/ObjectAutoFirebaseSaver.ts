import {inject, injectable} from 'inversify';
import {
    IDatabaseAutoSaver, IDatabaseSaver, IFirebaseRef, IObjectFirebaseAutoSaver, ISyncableValable,
} from '../interfaces';
import {TYPES} from '../types';
import {PropertyFirebaseSaver} from './PropertyFirebaseSaver';
import {PropertyAutoFirebaseSaver} from './PropertyAutoFirebaseSaver';

@injectable()
export class ObjectFirebaseAutoSaver implements IObjectFirebaseAutoSaver {
    private syncableObject: ISyncableValable
    private syncableObjectFirebaseRef: IFirebaseRef

    constructor(@inject(TYPES.ObjectFirebaseAutoSaverArgs){syncableObject, syncableObjectFirebaseRef}) {
        this.syncableObject = syncableObject
        this.syncableObjectFirebaseRef = syncableObjectFirebaseRef
    }

    public initialSave() {
        const val = this.syncableObject.val()
        this.syncableObjectFirebaseRef.update(val)
    }
    public start() {
        const propertiesToSync = this.syncableObject.getPropertiesToSync()
        for (const [propName, property] of Object.entries(propertiesToSync)) {
            const propertyFirebaseRef = this.syncableObjectFirebaseRef.child(propName)
            const propertyFirebaseSaver: IDatabaseSaver = new PropertyFirebaseSaver({firebaseRef: propertyFirebaseRef})
            const propertyAutoFirebaseSaver: IDatabaseAutoSaver = new PropertyAutoFirebaseSaver({
                saveUpdatesToDBFunction: propertyFirebaseSaver.save.bind(propertyFirebaseSaver)
            })
            propertyAutoFirebaseSaver.subscribe(property)
        }
    }
}

@injectable()
export class ObjectFirebaseAutoSaverArgs {
    @inject(TYPES.ISyncableValableObject) public syncableObject: ISyncableValable
}
