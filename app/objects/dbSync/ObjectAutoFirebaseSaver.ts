import {inject, injectable} from 'inversify';
import {
    IDatabaseAutoSaver, IDatabaseSaver, IHash, IObjectFirebaseAutoSaver, ISyncable, ISyncableValable, IValObject,
} from '../interfaces';
import {TYPES} from '../types';
import {PropertyFirebaseSaver} from './PropertyFirebaseSaver';
import {PropertyAutoFirebaseSaver} from './PropertyAutoFirebaseSaver';
import {log} from '../../core/log'
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

@injectable()
export class ObjectFirebaseAutoSaver implements IObjectFirebaseAutoSaver {
    private syncableObject: ISyncable
    private syncableObjectFirebaseRef: Reference

    constructor(@inject(TYPES.ObjectFirebaseAutoSaverArgs){
        syncableObject, syncableObjectFirebaseRef
    }: ObjectFirebaseAutoSaverArgs) {
        this.syncableObject = syncableObject
        this.syncableObjectFirebaseRef = syncableObjectFirebaseRef
    }

    public initialSave() {
        const saveVal: IHash<IValObject> = {}

        const propertiesToSync = this.syncableObject.getPropertiesToSync()
        for (const [propName, property] of Object.entries(propertiesToSync)) {
            saveVal[propName] = {
                val: property.val(),
            }
        }
        console.log('initialSave called. save val is ', saveVal)
        this.syncableObjectFirebaseRef.update(saveVal)
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
    @inject(TYPES.ISyncableValableObject) public syncableObject: ISyncable
    @inject(TYPES.FirebaseReference) public syncableObjectFirebaseRef: Reference
}
