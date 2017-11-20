import {ISubscribable} from '../ISubscribable';
import {IDbSyncable} from './IDbSyncable';
import {IFirebaseRef} from './IFirebaseRef';

class FirebaseSyncer implements IDbSyncable {
    private firebaseRef: IFirebaseRef
    constructor({firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    public save(updates: object) {
        this.firebaseRef.update(updates)
    }

    public subscribe(obj: ISubscribable) {
        const me = this
        obj.onUpdate(updates => {
            me.save(updates)
        })
    }
}
