import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatabaseAutoSaver, IDBSubscriber, ISubscribableContentUser} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToContentUser} from './DBSubscriberToContentUser';

let subscribableContentUser
let overdueSyncer: IDatabaseAutoSaver
let proficiencySyncer: IDatabaseAutoSaver
let lastRecordedStrengthSyncer: IDatabaseAutoSaver
let timerSyncer: IDatabaseAutoSaver
let dbSubscriberToContentUser: IDBSubscriber
test.beforeEach('constructor', () => {
    subscribableContentUser = myContainer.get<ISubscribableContentUser>(TYPES.ISubscribableContentUser)
    overdueSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    proficiencySyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    lastRecordedStrengthSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    timerSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    dbSubscriberToContentUser = new DBSubscriberToContentUser(
        {
            lastRecordedStrength: subscribableContentUser.lastRecordedStrength,
            lastRecordedStrengthSyncer,
            overdue: subscribableContentUser.overdue,
            overdueSyncer,
            proficiency: subscribableContentUser.proficiency,
            proficiencySyncer,
            timer: subscribableContentUser.timer,
            timerSyncer,
        }
    )
})
test('IDBSubscriber > DBSubscriberToContentUser::::subscribe' +
    ' should call subscribe on each of the database syncers', (t) => {
    const overdueSyncerSubscribeSpy = sinon.spy(overdueSyncer, 'subscribe')
    const proficiencySyncerSubscribeSpy = sinon.spy(proficiencySyncer, 'subscribe')
    const lastRecordedStrengthSyncerSubscribeSpy = sinon.spy(lastRecordedStrengthSyncer, 'subscribe')
    const timerSyncerSubscribeSpy = sinon.spy(timerSyncer, 'subscribe')
    expect(overdueSyncerSubscribeSpy.callCount).to.equal(0)
    expect(proficiencySyncerSubscribeSpy.callCount).to.equal(0)
    expect(lastRecordedStrengthSyncerSubscribeSpy.callCount).to.equal(0)
    expect(timerSyncerSubscribeSpy.callCount).to.equal(0)

    dbSubscriberToContentUser.subscribe()

    expect(overdueSyncerSubscribeSpy.callCount).to.equal(1)
    expect(proficiencySyncerSubscribeSpy.callCount).to.equal(1)
    expect(lastRecordedStrengthSyncerSubscribeSpy.callCount).to.equal(1)
    expect(timerSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
})
