import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {IDatabaseSyncer, IDBSubscriber, ISubscribableTreeLocation} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTreeLocation, DBSubscriberToTreeLocationArgs} from './DBSubscriberToTreeLocation';

let subscribableTreeLocation
let proficiencyStatsSyncer: IDatabaseSyncer
let aggregationTimerSyncer: IDatabaseSyncer
let dbSubscriberToTreeLocation: IDBSubscriber
test.beforeEach('constructor', () => {
    subscribableTreeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
    proficiencyStatsSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    aggregationTimerSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    dbSubscriberToTreeLocation = new DBSubscriberToTreeLocation(
        {
            aggregationTimer: subscribableTreeLocation.aggregationTimer,
            aggregationTimerSyncer,
            proficiencyStats: subscribableTreeLocation.proficiencyStats,
            proficiencyStatsSyncer,
        }
    )
})
// test('IDBSubscriber > DBSubscriberToTreeLocation::::subscribe' +
//     ' DI constructor should work', (t) => {
//     const injects = injectionWorks<DBSubscriberToTreeLocationArgs, IDBSubscriber>({
//         container: myContainer,
//         argsType: TYPES.DBSubscriberToTreeLocationArgs,
//         interfaceType: TYPES.IDBSubscriber,
//     })
//     expect(injects).to.equal(true)
//     t.pass()
// })
test('IDBSubscriber > DBSubscriberToTreeLocation::::subscribe' +
    ' should call subscribe on each of the database syncers', (t) => {
    const proficiencyStatsSyncerSubscribeSpy = sinon.spy(proficiencyStatsSyncer, 'subscribe')
    const aggregationTimerSyncerSubscribeSpy = sinon.spy(aggregationTimerSyncer, 'subscribe')
    expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(0)
    expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(0)

    dbSubscriberToTreeLocation.subscribe()

    expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(1)
    expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
})
