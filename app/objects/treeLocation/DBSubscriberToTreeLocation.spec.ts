import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {log} from '../../core/log'
import {injectionWorks} from '../../testHelpers/testHelpers';
import {
    IDatabaseSyncer, IDBSubscriber, IDBSubscriberToTreeLocation, IMutableSubscribablePoint,
    ISubscribableTreeLocation
} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTreeLocation, DBSubscriberToTreeLocationArgs} from './DBSubscriberToTreeLocation';

let subscribableTreeLocation
let pointSyncer: IDatabaseSyncer
let dbSubscriberToTreeLocation: IDBSubscriber
test.beforeEach('constructor', () => {
    subscribableTreeLocation = myContainer.get<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation)
    log('subscribableTreeLocation and props are ' + subscribableTreeLocation +
        subscribableTreeLocation.aggregationTimer + subscribableTreeLocation.proficiencyStats)
    pointSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    dbSubscriberToTreeLocation = new DBSubscriberToTreeLocation(
        {
            point: subscribableTreeLocation.point,
            pointSyncer,
        }
    )
})
test('IDBSubscriber > DBSubscriberToTreeLocation::::subscribe' +
    ' DI constructor should work', (t) => {
    const injects = injectionWorks<DBSubscriberToTreeLocationArgs, IDBSubscriberToTreeLocation>({
        container: myContainer,
        argsType: TYPES.DBSubscriberToTreeLocationArgs,
        interfaceType: TYPES.IDBSubscriberToTreeLocation,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('IDBSubscriber > DBSubscriberToTreeLocation::::subscribe' +
    ' should call subscribe on each of the database syncers', (t) => {
    const pointSyncerSubscribeSpy = sinon.spy(pointSyncer, 'subscribe')
    expect(pointSyncerSubscribeSpy.callCount).to.equal(0)

    dbSubscriberToTreeLocation.subscribe()

    expect(pointSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
})
