import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatabaseSyncer, IDBSubscriber, ISubscribableContent} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToContent} from './DBSubscriberToContent';
import test from 'ava'

let subscribableContent
let typeSyncer: IDatabaseSyncer
let titleSyncer: IDatabaseSyncer
let questionSyncer: IDatabaseSyncer
let answerSyncer: IDatabaseSyncer
let dbSubscriberToContent: IDBSubscriber
test.beforeEach('constructor', (t) => {
    subscribableContent = myContainer.get<ISubscribableContent>(TYPES.ISubscribableContent)
    typeSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    titleSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    questionSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    answerSyncer = myContainer.get<IDatabaseSyncer>(TYPES.IDatabaseSyncer)
    dbSubscriberToContent = new DBSubscriberToContent(
        {
            question: subscribableContent.question,
            questionSyncer,
            type: subscribableContent.type,
            typeSyncer,
            title: subscribableContent.title,
            titleSyncer,
            answer: subscribableContent.answer,
            answerSyncer,
        }
    )
})
test('IDBSubscriber > DBSubscriberToContent:::subscribe should call subscribe on each of the database syncers', (t) => {
    const typeSyncerSubscribeSpy = sinon.spy(typeSyncer, 'subscribe')
    const titleSyncerSubscribeSpy = sinon.spy(titleSyncer, 'subscribe')
    const questionSyncerSubscribeSpy = sinon.spy(questionSyncer, 'subscribe')
    const answerSyncerSubscribeSpy = sinon.spy(answerSyncer, 'subscribe')
    expect(typeSyncerSubscribeSpy.callCount).to.equal(0)
    expect(titleSyncerSubscribeSpy.callCount).to.equal(0)
    expect(questionSyncerSubscribeSpy.callCount).to.equal(0)
    expect(answerSyncerSubscribeSpy.callCount).to.equal(0)

    dbSubscriberToContent.subscribe()

    expect(typeSyncerSubscribeSpy.callCount).to.equal(1)
    expect(titleSyncerSubscribeSpy.callCount).to.equal(1)
    expect(questionSyncerSubscribeSpy.callCount).to.equal(1)
    expect(answerSyncerSubscribeSpy.callCount).to.equal(1)
    t.pass()
 })
