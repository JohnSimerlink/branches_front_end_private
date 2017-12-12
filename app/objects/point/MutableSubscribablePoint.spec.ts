import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatedMutation, IMutableSubscribablePoint, PointMutationTypes} from '../interfaces';
import {MutableSubscribablePoint} from './MutableSubscribablePoint'

// import {Point} from '../app/objects/point/point'
/*
TODO: For MY Mutation tests, for performance reasons,
 there should be a way to declare certain mutation/object sets as
  commutative or non-commutative. Because in this example shifting is
   commutative, so I don't have to recalculate everything from scratch
    (or at least from a checkpoint). Whereas, for other operations that
     may not be the case.
 */
/*
 Does Point really care about what type of mutations are listed? It just wants certain behavior
 - Being able to get the mutationList
 - 1 Being able to undo/redo arbitrary mutations
 - 2 Not being able to undo the first mutation
 - 3 Being able to add new mutations
 - Being able to get the current coordinate value
 - Having those 3 specs appropriately adjust the coordinate value
  */
describe('Point > Mutable', () => {
    // FIRST_MUTATION_VALUE is {x: 5, y: 7}
    // const po = new MutableSubscribablePoint({x:5, y:6})
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const FIRST_MUTATION_VALUE = {x: 3, y: 4}
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + FIRST_MUTATION_VALUE.x, y: FIRST_POINT_VALUE.y + FIRST_MUTATION_VALUE.y
    }
    const SECOND_MUTATION_VALUE = {x: -3, y: -4}
    const THIRD_POINT_VALUE = {
        x: SECOND_POINT_VALUE.x + SECOND_MUTATION_VALUE.x, y: SECOND_POINT_VALUE.y + SECOND_MUTATION_VALUE.y
    }
    const THIRD_MUTATION_VALUE = {x: 13, y: 14}
    const FOURTH_POINT_VALUE = {
        x: THIRD_POINT_VALUE.x + THIRD_MUTATION_VALUE.x, y: THIRD_POINT_VALUE.y + THIRD_MUTATION_VALUE.y
    }
    const FOURTH_MUTATION_VALUE = {x: 100, y: 100}
    const FIFTH_POINT_VALUE = {
        x: FOURTH_POINT_VALUE.x + FOURTH_MUTATION_VALUE.x, y: FOURTH_POINT_VALUE.y + FOURTH_MUTATION_VALUE.y
    }
    const FIFTH_MINUS_1ST_AND_3RD_MUTATIONS_VALUE = {
        x: FIFTH_POINT_VALUE.x - THIRD_MUTATION_VALUE.x - FIRST_MUTATION_VALUE.x,
        y: FIFTH_POINT_VALUE.y - THIRD_MUTATION_VALUE.y - FIRST_MUTATION_VALUE.y
    }
    const FIFTH_MINUS_1ST_MUTATION_VALUE = {
        x: FIFTH_POINT_VALUE.x - FIRST_MUTATION_VALUE.x,
        y: FIFTH_POINT_VALUE.y - FIRST_MUTATION_VALUE.y
    }
    // const point = new MutableSubscribablePoint(FIRST_POINT_VALUE.x, FIRST_POINT_VALUE.y)
    const point = new MutableSubscribablePoint({...FIRST_POINT_VALUE, updatesCallbacks: []})
    const FIRST_MUTATION_INDEX = 0
    const SECOND_MUTATION_INDEX = 1
    const THIRD_MUTATION_INDEX = 2
    const FOURTH_MUTATION_INDEX = 3
    it('should set x and y from constructor', () => {
        expect(point.val()).to.deep.equal(FIRST_POINT_VALUE)
    })

    it('should have 0 mutations after creation', () => {
        expect(point.mutations().length).to.equal(0)
        // TODO: ^^ Fix Violation of Law of Demeter
    } )

    // const firstMutation = point.mutations(FIRST_MUTATION_INDEX)
    it(`second mutation should change the point val
    to the second point val,
    and mutation result should have the result val`, () => {
        const mutation = {type: PointMutationTypes.SHIFT, timestamp: Date.now(), data: {delta: FIRST_MUTATION_VALUE}}
        point.addMutation(mutation)
        expect(point.mutations().length).to.equal(1)
        // TODO: ^^ Fix Violation of Law of Demeter
        expect(point.val()).to.deep.equal(SECOND_POINT_VALUE)
    })
    it(`should error on trying to be redo a mutation that hasn't
     been undone PT2, and point val should still be the same`, () => {
        expect(() => point.redo(FIRST_MUTATION_INDEX)).to.throw(RangeError)
    } )
    it(`undoing the second mutation should make point equivalent
     to the original value second mutation`, () => {
        point.undo(FIRST_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIRST_POINT_VALUE)
    })
    it(`redoing the second mutation should make point equivalent
     to the second point value`, () => {
        point.redo(FIRST_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(SECOND_POINT_VALUE)
    })
    it(`adding the third and fourth and fifth mutation should make the point
    equivalent to the fifth point value`, () => {
        const thirdMutation = {
            data: {delta: SECOND_MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        const fourthMutation = {
            data: {delta: THIRD_MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        const fifthMutation = {
            data: {delta: FOURTH_MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        point.addMutation(thirdMutation)
        point.addMutation(fourthMutation)
        point.addMutation(fifthMutation)
        expect(point.val()).to.deep.equal(FIFTH_POINT_VALUE)
    })
    it(`undoing the second and fourth mutations should recalculate
     the state as the sum of the 1st, third, and 5th mutations`, () => {
        point.undo(FIRST_MUTATION_INDEX)
        point.undo(THIRD_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIFTH_MINUS_1ST_AND_3RD_MUTATIONS_VALUE)
    })
    it(`redoing the second and fourth mutations should recalculate
     the state as the sum of the 1st, third, fourth, and 5th mutations`, () => {
        point.redo(THIRD_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIFTH_MINUS_1ST_MUTATION_VALUE)
    })
    it(`should error on trying to be redo a mutation that hasn't
     been undone (or that has been redone),
     and point val should still be the same`, () => {
        expect(() => point.redo(THIRD_MUTATION_INDEX)).to.throw(RangeError)
    })
})

describe('Point > Subscribable', () => {
    it('Adding a mutation, should trigger an update for one of the subscribers ', () => {

        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {x: 3, y: 4}
        const subscribableMutablePoint: IMutableSubscribablePoint
            = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
        const callback = sinon.spy() // (updates: IDetailedUpdates) => void 0
        const mutation: IDatedMutation<PointMutationTypes> = {
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
            data: {delta: {...MUTATION_VALUE}},
        }

        subscribableMutablePoint.onUpdate(callback)
        subscribableMutablePoint.addMutation(mutation)
        expect(callback.callCount).to.equal(1)
    })
    it('Adding a mutation, should trigger an update for multiple subscribers ', () => {
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {x: 3, y: 4}
        const subscribableMutablePoint: IMutableSubscribablePoint
            = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
        const callback1 = sinon.spy() // (updates: IDetailedUpdates) => void 0
        const callback2 = sinon.spy() // (updates: IDetailedUpdates) => void 0
        const mutation: IDatedMutation<PointMutationTypes> = {
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
            data: {delta: {...MUTATION_VALUE}},
        }
        subscribableMutablePoint.onUpdate(callback1)
        subscribableMutablePoint.onUpdate(callback2)
        subscribableMutablePoint.addMutation(mutation)
        expect(callback1.callCount).to.equal(1)
        expect(callback2.callCount).to.equal(1)
    })
})
