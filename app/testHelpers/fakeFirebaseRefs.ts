import {IFirebaseRef, IPushable} from '../objects/interfaces';
import {TREE_ID} from './testHelpers';

class FakeFirebaseTreeRef implements IFirebaseRef {
    public update(updates: object) {
    }

    public child(path: string): IPushable {
        // case TREE_ID: {
        //
        // }
        return undefined;
    }

    public on(eventName: string) {


    }

}