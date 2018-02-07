import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {IDatabaseAutoSaver, IDBSubscriber, ISubscribableContent} from '../interfaces';
import {TYPES} from '../types';
import {DBSubscriberToContent} from './DBSubscriberToContent';
import test from 'ava'

myContainerLoadAllModules()
let subscribableContent
let typeSyncer: IDatabaseAutoSaver
let titleSyncer: IDatabaseAutoSaver
let questionSyncer: IDatabaseAutoSaver
let answerSyncer: IDatabaseAutoSaver
let dbSubscriberToContent: IDBSubscriber
test.beforeEach('constructor', (t) => {
    subscribableContent = myContainer.get<ISubscribableContent>(TYPES.ISubscribableContent)
    typeSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    titleSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    questionSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
    answerSyncer = myContainer.get<IDatabaseAutoSaver>(TYPES.IDatabaseAutoSaver)
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
