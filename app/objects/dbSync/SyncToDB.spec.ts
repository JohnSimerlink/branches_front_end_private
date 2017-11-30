import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {ISubscribable} from '../subscribable/ISubscribable';
import {TYPES} from '../types';
import {IDetailedUpdates} from './IDetailedUpdates';
import {SaveUpdatesToDBFunction} from './ISaveUpdatesToDBFunction';
import {SyncToDB} from './SyncToDB';

describe('IDatabaseSyncer > SyncToDB', () => {
    // const firebaseRef = 'path/subpath/prop'
    // const
    const saveUpdatesToDBFunction = myContainer.get<SaveUpdatesToDBFunction>(TYPES.SaveUpdatesToDBFunction)
    const syncToDB = new SyncToDB({saveUpdatesToDBFunction})
    // var spy = sinon.spy(saveUpdatesToDBFunction)
    // TODO: test the constructor to ensure it takes into account the firebaseRef

    /* so i need to test if subscribe works
    todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
     But that would be inspecting on a different object, making this an integration, not a unit test.
     And numSubscribers is a privated variable. Actually it doesn't even exist.
      2) call callCallbacks on the Subscribable and see if that calls syncToDB's private save method . . .
      but that would be unit testing a private method . . .
    */

    const objectToKeepSynced: ISubscribable<IDetailedUpdates> = {
        onUpdate() { return void 0 }
    }

    it(`subscribe should call ISubscribable onUpdate method to add the subscriber\'s
     callback method to the Subscribable\'s callback list`, () => {
        const onUpdateSpy = sinon.spy(objectToKeepSynced, 'onUpdate')
        syncToDB.subscribe(objectToKeepSynced)
        // expect(JSON.stringify(sinon)).to.equal('hi')
        expect(onUpdateSpy.callCount).to.equal(1)
    })
})
