import {expect} from 'chai';
import * as sinon from 'sinon';
import {IDetailedUpdates, ISubscribable} from '../interfaces';
import {PropertyAutoFirebaseSaver} from './PropertyAutoFirebaseSaver';
import test from 'ava';

test(`IDatabaseSyncer > SyncToDB:::::subscribe should call ISubscribable onUpdate method to add the subscriber\'s
 callback method to the Subscribable\'s callback list`, (t) => {
    const saveUpdatesToDBFunction = (updates: IDetailedUpdates) => void 0;
    const syncToDB = new PropertyAutoFirebaseSaver({saveUpdatesToDBFunction});

    const objectToKeepSynced: ISubscribable<IDetailedUpdates> = {
        onUpdate() { return void 0; }
    };
    const onUpdateSpy = sinon.spy(objectToKeepSynced, 'onUpdate');
    syncToDB.subscribe(objectToKeepSynced);
    expect(onUpdateSpy.callCount).to.equal(1);
    t.pass();
});
