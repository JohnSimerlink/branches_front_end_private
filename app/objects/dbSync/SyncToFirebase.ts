// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {ISubscribable} from '../ISubscribable';
import {ISubscriber} from '../ISubscriber';
import {TYPES} from '../types';
import {IDatabaseSyncer} from './IDatabaseSyncer';
import {IDbSyncable} from './IDbSyncable';
import {IFirebaseRef} from './IFirebaseRef';
import {IUpdates} from './IUpdates';

@injectable()
class SyncToFirebase implements IDatabaseSyncer {
    private firebaseRef: IFirebaseRef
    constructor(@inject(TYPES.FirebaseSyncerArgs){firebaseRef}) {
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
@injectable()
class SyncToFirebaseArgs {
    @inject(TYPES.String) public firebaseRef
}

export {SyncToFirebase, SyncToFirebaseArgs}
