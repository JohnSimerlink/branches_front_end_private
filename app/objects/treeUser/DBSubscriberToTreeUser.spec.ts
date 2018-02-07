import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {IDatabaseAutoSaver, IDBSubscriber, ISubscribableTreeUser} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTreeUser} from './DBSubscriberToTreeUser';

myContainerLoadAllModules()
let subscribableTreeUser
let proficiencyStatsSyncer: IDatabaseAutoSaver
let aggregationTimerSyncer: IDatabaseAutoSaver
let dbSubscriberToTreeUser: IDBSubscriber
test.beforeEach('constructor', () => {
    subscribableTreeUser = myContainer.get<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser)
    proficiencyStatsSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    aggregationTimerSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    dbSubscriberToTreeUser = new DBSubscriberToTreeUser(
        {
            aggregationTimer: subscribableTreeUser.aggregationTimer,
            aggregationTimerSyncer,
            proficiencyStats: subscribableTreeUser.proficiencyStats,
            proficiencyStatsSyncer,
        }
    )
})
test('IDBSubscriber > DBSubscriberToTreeUser::::subscribe' +
    ' should call subscribe on each of the database syncers', (t) => {
    
    const proficiencyStatsSyncerSubscribeSpy = sinon.spy(proficiencyStatsSyncer, 'subscribe')
    const aggregationTimerSyncerSubscribeSpy = sinon.spy(aggregationTimerSyncer, 'subscribe')
    expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(0)
    expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(0)

    dbSubscriberToTreeUser.subscribe()

    expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(1)
    expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
 })
