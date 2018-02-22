import test from 'ava'
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {FieldMutationTypes, IDatedMutation, timestamp} from '../interfaces';
import {OverdueListenerCore} from './overdueListener';
import {expect} from 'chai'
import * as sinon from 'sinon'
import {log} from '../../core/log'

// test('overdueListenerCore - setOverdueTimer', t => {
//
//     const now = Date.now()
//     const howManyMillisecondsTilOverdue = 5000
//     const nextReviewTimeVal = now + howManyMillisecondsTilOverdue
//     const nextReviewTime = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
//     const overdue = new MutableSubscribableField<boolean>({field: false})
//
//     const overdueListenerCore = new OverdueListenerCore({
//         nextReviewTime,
//         overdue,
//         timeoutId: null
//     })
//     const clock = sinon.useFakeTimers(now)
//
//     overdueListenerCore.setOverdueTimer()
//     expect(overdue.val()).to.deep.equal(false)
//     clock.tick(howManyMillisecondsTilOverdue + 100)
//     expect(overdue.val()).to.deep.equal(true)
//
//     t.pass()
// })
test('overdueListenerCore - listenAndReactToAnyNextReviewTimeChanges', t => {
    const now = Date.now()
    const clock = sinon.useFakeTimers(now)
    const howManyMillisecondsTilOverdue = -5000
    const nextReviewTimeVal = now + howManyMillisecondsTilOverdue
    const nextReviewTime = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    const overdue = new MutableSubscribableField<boolean>({field: true})

    const overdueListenerCore = new OverdueListenerCore({
        nextReviewTime,
        overdue,
        timeoutId: null
    })
    // nextReviewTime.
    overdueListenerCore.listenAndReactToAnyNextReviewTimeChanges()
    expect(overdue.val()).to.deep.equal(true)
    const now2 = Date.now()
    const howManyMillisecondsTilOverdue2 = 20000
    const newNextReviewTime = now2 + howManyMillisecondsTilOverdue2
    const setReviewTimeMutation: IDatedMutation<FieldMutationTypes> = {
        timestamp: now2,
        type: FieldMutationTypes.SET,
        data: newNextReviewTime
    }
    nextReviewTime.addMutation(setReviewTimeMutation)
    expect(overdue.val()).to.deep.equal(false)
    clock.tick(howManyMillisecondsTilOverdue2 + 100)
    expect(overdue.val()).to.deep.equal(true)

    // should set false

    // should clear any current timers

    // should call set overdue timer

    // const now = Date.now()
    // const howManyMillisecondsTilOverdue = 5000
    // const nextReviewTimeVal = now + howManyMillisecondsTilOverdue
    // const nextReviewTime = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal})
    // const overdue = new MutableSubscribableField<boolean>({field: false})
    //
    // const overdueListenerCore = new OverdueListenerCore({
    //     nextReviewTime,
    //     overdue,
    //     timeoutId: null
    // })
    // const clock = sinon.useFakeTimers(now)
    //
    // overdueListenerCore.setOverdueTimer()
    // expect(overdue.val()).to.deep.equal(false)
    // clock.tick(howManyMillisecondsTilOverdue + 100)
    // expect(overdue.val()).to.deep.equal(true)

    t.pass()
})
