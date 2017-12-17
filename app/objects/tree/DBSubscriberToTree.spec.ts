import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {
    IDatabaseSyncer, IDBSubscriber, IDBSubscriberToTree, ISubscribableTree,
    ISubscribableTreeCore
} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTree, DBSubscriberToTreeArgs} from './DBSubscriberToTree';
import {injectionWorks} from '../../testHelpers/testHelpers';
let subscribableTree
let contentIdSyncer
let parentIdSyncer
let childrenSyncer
let dbSubscriberToTree: IDBSubscriber
test.beforeEach('constructor', () => {
    subscribableTree = myContainer.get<ISubscribableTree>(TYPES.ISubscribableTree)
    contentIdSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    parentIdSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    childrenSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    dbSubscriberToTree = new DBSubscriberToTree(
        {
            children: subscribableTree.children,
            childrenSyncer,
            contentId: subscribableTree.contentId,
            contentIdSyncer,
            parentId: subscribableTree.parentId,
            parentIdSyncer,
        }
    )
})
test('IDBSubscriber > DBSubscriberToTree::::subscribe' +
    ' DI constructor should work', (t) => {
    const injects = injectionWorks<DBSubscriberToTreeArgs, IDBSubscriberToTree>({
        container: myContainer,
        argsType: TYPES.DBSubscriberToTreeArgs,
        interfaceType: TYPES.IDBSubscriberToTree,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('IDBSubscriber > DBSubscriberToTree::::' +
    'subscribe should call subscribe on each of the database syncers', (t) => {
    const contentIdSyncerSubscribeSpy = sinon.spy(contentIdSyncer, 'subscribe')
    const parentIdSyncerSubscribeSpy = sinon.spy(parentIdSyncer, 'subscribe')
    const childrenSyncerSubscribeSpy = sinon.spy(childrenSyncer, 'subscribe')
    expect(contentIdSyncerSubscribeSpy.callCount).to.equal(0)
    expect(parentIdSyncerSubscribeSpy.callCount).to.equal(0)
    expect(childrenSyncerSubscribeSpy.callCount).to.equal(0)
    dbSubscriberToTree.subscribe()
    expect(contentIdSyncerSubscribeSpy.callCount).to.equal(1)
    expect(parentIdSyncerSubscribeSpy.callCount).to.equal(1)
    expect(childrenSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
 })
