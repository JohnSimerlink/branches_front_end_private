import {ISubscribable} from '../ISubscribable';
import {ISubscriber} from '../ISubscriber';
import {IDatabaseSyncer} from './IDatabaseSyncer';
import {IDbSyncable} from './IDbSyncable';
import {IFirebaseRef} from './IFirebaseRef';
import {IUpdates} from './IUpdates';

class FirebaseSyncer implements IDatabaseSyncer {
    private firebaseRef: IFirebaseRef
    constructor({firebaseRef}) {
        this.firebaseRef = firebaseRef
    }
    private save(updates: IUpdates) {
        this.firebaseRef.update(updates.updates)
        const pushes = updates.pushes
        for (const [arrayName, pushedValue] of Object.entries(pushes)) {
            this.firebaseRef
                .child(arrayName)
                .push(pushedValue) // TODO: fix violation of Law of Demeter
        }
    }

    public subscribe(obj: ISubscribable) {
        obj.onUpdate(this.save)
    }
}

export {FirebaseSyncer}
