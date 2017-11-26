import {IFirebaseRef} from './IFirebaseRef';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';

// stub for testing
@injectable()
class FirebaseRef implements IFirebaseRef {
    @inject(TYPES.Object) public update(updates: object) { return void 0}
    public child(path: string) { return void 0: IPushable}
}


export {FirebaseRef}
