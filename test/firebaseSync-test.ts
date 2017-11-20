import {FirebaseSyncer} from '../app/objects/dbSync/FirebaseSyncer';
import {ISubscribable} from '../app/objects/ISubscribable';

describe('firebaseSync', () => {
    const firebaseRef = 'path/subpath/prop'
    const firebaseSyncer = new FirebaseSyncer({firebaseRef})

    /* so i need to test if subscribe works
    todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
     But that would be inspecting on a different object, making this an integration, not a unit test.
      2) call callCallbacks on the Subscribable and see if that calls firebaseSyncer's private save method . . .
      but that would be unit testing a private method . . .
    */
    const objectToKeepSynced: ISubscribable = {
        onUpdate() { return void 0 }
    }
})
