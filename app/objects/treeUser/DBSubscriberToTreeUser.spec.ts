import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatabaseSyncer, IDBSubscriber, ISubscribableTreeUser} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTreeUser} from './DBSubscriberToTreeUser';

describe('IDBSubscriber > DBSubscriberToTreeUser', () => {
    let subscribableTreeUser
    let proficiencyStatsSyncer: IDatabaseSyncer
    let aggregationTimerSyncer: IDatabaseSyncer
    let dbSubscriberToTreeUser: IDBSubscriber
    beforeEach('constructor', () => {
        subscribableTreeUser = myContainer.get<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser)
        proficiencyStatsSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
        aggregationTimerSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
        dbSubscriberToTreeUser = new DBSubscriberToTreeUser(
            {
                aggregationTimer: subscribableTreeUser.aggregationTimer,
                aggregationTimerSyncer,
                proficiencyStats: subscribableTreeUser.proficiencyStats,
                proficiencyStatsSyncer,
            }
        )
    })
    it('subscribe should call subscribe on each of the database syncers', () => {
        const proficiencyStatsSyncerSubscribeSpy = sinon.spy(proficiencyStatsSyncer, 'subscribe')
        const aggregationTimerSyncerSubscribeSpy = sinon.spy(aggregationTimerSyncer, 'subscribe')
        expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(0)
        expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(0)

        dbSubscriberToTreeUser.subscribe()

        expect(proficiencyStatsSyncerSubscribeSpy.callCount).to.equal(1)
        expect(aggregationTimerSyncerSubscribeSpy.callCount).to.equal(1)
     })
})
