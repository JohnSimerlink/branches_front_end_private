import {inject, injectable} from 'inversify';
import {
    IDatabaseAutoSaver, IDatabaseSaver, IFirebaseRef, IObjectFirebaseAutoSaver, ISyncableValable,
} from '../interfaces';
import {TYPES} from '../types';
import {PropertyFirebaseSaver} from './PropertyFirebaseSaver';
import {PropertyAutoFirebaseSaver} from './PropertyAutoFirebaseSaver';
import {log} from '../../core/log'

@injectable()
export class ObjectFirebaseAutoSaver implements IObjectFirebaseAutoSaver {
    private syncableObject: ISyncableValable
    private syncableObjectFirebaseRef: IFirebaseRef

    constructor(@inject(TYPES.ObjectFirebaseAutoSaverArgs){
        syncableObject, syncableObjectFirebaseRef
    }: {
            syncableObject: ISyncableValable,
            syncableObjectFirebaseRef: IFirebaseRef
        }) {
        this.syncableObject = syncableObject
        this.syncableObjectFirebaseRef = syncableObjectFirebaseRef
    }

    public initialSave() {
        const saveVal = {}

        const propertiesToSync = this.syncableObject.getPropertiesToSync()
        for (const [propName, property] of Object.entries(propertiesToSync)) {
            saveVal[propName] = {
                val: property.val()
            }
        }
        log('initialSave ObjectAutoFirebaseSaver val is', saveVal)
        this.syncableObjectFirebaseRef.update(saveVal)
    }
    public start() {
        log('ObjectAutoFirebaseSaver start called for', this.syncableObject, this.syncableObjectFirebaseRef)
        const propertiesToSync = this.syncableObject.getPropertiesToSync()
        for (const [propName, property] of Object.entries(propertiesToSync)) {
            const propertyFirebaseRef = this.syncableObjectFirebaseRef.child(propName)
            const propertyFirebaseSaver: IDatabaseSaver = new PropertyFirebaseSaver({firebaseRef: propertyFirebaseRef})
            const propertyAutoFirebaseSaver: IDatabaseAutoSaver = new PropertyAutoFirebaseSaver({
                saveUpdatesToDBFunction: propertyFirebaseSaver.save.bind(propertyFirebaseSaver)
            })
            log('ObjectAutoFirebaseSaver ', propName, property, ' about to get subscribed to')
            propertyAutoFirebaseSaver.subscribe(property)
            log('ObjectAutoFirebaseSaver ', propName, property, ' just got subscribed to')
        }
    }
}

@injectable()
export class ObjectFirebaseAutoSaverArgs {
    @inject(TYPES.ISyncableValableObject) public syncableObject: ISyncableValable
}
