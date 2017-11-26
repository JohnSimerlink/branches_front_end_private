import {expect} from 'chai'
import * as sinon from 'sinon'
import {ISubscribable} from '../ISubscribable';
import {FirebaseSyncer} from './FirebaseSyncer';

describe('IDatabaseSyncer > firebaseSync', () => {
    const firebaseRef = 'path/subpath/prop'
    const firebaseSyncer = new FirebaseSyncer({firebaseRef})
    // TODO: test the constructor to ensure it takes into account the firebaseRef

    /* so i need to test if subscribe works
    todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
     But that would be inspecting on a different object, making this an integration, not a unit test.
     And numSubscribers is a privated variable. Actually it doesn't even exist.
      2) call callCallbacks on the Subscribable and see if that calls firebaseSyncer's private save method . . .
      but that would be unit testing a private method . . .
    */
    const objectToKeepSynced: ISubscribable = {
        onUpdate() { return void 0 }
    }

    it(`subscribe should call ISubscribable onUpdate method to add the subscriber\'s
     callback method to the Subscribable\'s callback list`, () => {
        const onUpdateSpy = sinon.spy(objectToKeepSynced, 'onUpdate')
        firebaseSyncer.subscribe(objectToKeepSynced)
        // expect(JSON.stringify(sinon)).to.equal('hi')
        expect(onUpdateSpy.callCount).to.equal(1)
    })
})
