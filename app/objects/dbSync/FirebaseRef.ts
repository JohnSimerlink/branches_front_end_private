import {IFirebaseRef} from './IFirebaseRef';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {IPushable} from './IPushable';

// stub for testing
@injectable()
class FirebaseRef implements IFirebaseRef {
    public update(updates: object) { return void 0}
    public child(path: string): IPushable { return []}
}

export {FirebaseRef}
