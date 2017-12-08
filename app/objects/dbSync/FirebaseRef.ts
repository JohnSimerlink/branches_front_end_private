import {injectable} from 'inversify';
import {IFirebaseRef, IPushable} from '../interfaces'

// stub for testing
@injectable()
class FirebaseRef implements IFirebaseRef {
    public on(eventName: string, callback: (ISnapshot) => {}) { return void 0 }
    public update(updates: object) { return void 0}
    public child(path: string): IPushable { return []}
}

export {FirebaseRef}
