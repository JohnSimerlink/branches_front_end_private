import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatabaseSyncer, ISubscribableTreeCore} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToTree} from './DBSubscriberToTree';

describe('IDBSubscriber > DBSubscriberToTree', () => {

    let subscribableTree
    let contentIdSyncer
    let parentIdSyncer
    let childrenSyncer
    let dbSubscriberToTree: DBSubscriberToTree
    beforeEach('constructor', () => {
        subscribableTree = myContainer.get<ISubscribableTreeCore>(TYPES.ISubscribableTree)
        contentIdSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
        parentIdSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
        childrenSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
        dbSubscriberToTree = new DBSubscriberToTree(subscribableTree, contentIdSyncer, parentIdSyncer, childrenSyncer)
    })
    it('subscribe should call subscribe on each of the database syncers', () => {
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
     })
})
