// import {expect} from 'chai'
// import * as sinon from 'sinon'
// import {myContainer} from '../../../inversify.config';
// import {IDatabaseSyncer, IDBSubscriber, ISubscribableTreeLocation} from '../interfaces';
// import {TYPES} from '../types';
// import {DBSubscriberToTreeLocation} from './DBSubscriberToTreeLocation';
//
// describe('IDBSubscriber > DBSubscriberToTreeLocation', () => {
//     let subscribableTreeLocation
//     let proficiencyStatsSyncer: IDatabaseSyncer
//     let aggregationTimerSyncer: IDatabaseSyncer
//     let dbSubscriberToTreeLocation: IDBSubscriber
//     beforeEach('constructor', () => {
//         subscribableTreeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
//         proficiencyStatsSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
//         aggregationTimerSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
//         dbSubscriberToTreeLocation = new DBSubscriberToTreeLocation(
//             {
//                 aggregationTimer: subscribableTreeLocation.aggregationTimer,
//                 aggregationTimerSyncer,
//                 proficiencyStats: subscribableTreeLocation.proficiencyStats,
//                 proficiencyStatsSyncer,
//             }
//         )
//     })
//     it('subscribe should call subscribe on each of the database syncers', () => {
//         const proficiencyStatsSyncerSubscribeSpy = sinon.spy(proficiencyStatsSyncer, 'subscribe')
//         const aggregationTimerSyncerSubscribeSpy = sinon.spy(aggregationTimerSyncer, 'subscribe')
//         expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(0)
//         expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(0)
//
//         dbSubscriberToTreeLocation.subscribe()
//
//         expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(1)
//         expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(1)
//      })
// })
