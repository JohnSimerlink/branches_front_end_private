import {expect} from 'chai'
import 'reflect-metadata'
import {Point} from '../app/objects/point/point'
import {PointMutationTypes} from '../app/objects/point/PointMutationTypes';
import {TYPES} from '../app/objects/types';
import {myContainer} from '../inversify.config'

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
describe('Point', () => {
    // FIRST_MUTATION_VALUE is {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const SECOND_MUTATION_VALUE = {x: 3, y: 4}
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + SECOND_MUTATION_VALUE.x, y: FIRST_POINT_VALUE.y + SECOND_MUTATION_VALUE.y
    }
    const THIRD_MUTATION_VALUE = {x: -3, y: -4}
    const THIRD_POINT_VALUE = {
        x: SECOND_POINT_VALUE.x + THIRD_MUTATION_VALUE.x, y: SECOND_POINT_VALUE.y + THIRD_MUTATION_VALUE.y
    }
    const FOURTH_MUTATION_VALUE = {x: 13, y: 14}
    const FOURTH_POINT_VALUE = {
        x: THIRD_POINT_VALUE.x + FOURTH_MUTATION_VALUE.x, y: THIRD_POINT_VALUE.y + FOURTH_MUTATION_VALUE.y
    }
    const FIFTH_MUTATION_VALUE = {x: 100, y: 100}
    const FIFTH_POINT_VALUE = {
        x: FOURTH_POINT_VALUE.x + FIFTH_MUTATION_VALUE.x, y: FOURTH_POINT_VALUE.y + FIFTH_MUTATION_VALUE.y
    }
    const FIFTH_MINUS_2ND_AND_4TH_MUTATIONS_VALUE = {
        x: FIFTH_POINT_VALUE.x - FOURTH_MUTATION_VALUE.x - SECOND_MUTATION_VALUE.x,
        y: FIFTH_POINT_VALUE.y - FOURTH_MUTATION_VALUE.y - SECOND_MUTATION_VALUE.y
    }
    const FIFTH_MINUS_2ND_MUTATION_VALUE = {
        x: FIFTH_POINT_VALUE.x - SECOND_MUTATION_VALUE.x,
        y: FIFTH_POINT_VALUE.y - SECOND_MUTATION_VALUE.y
    }
    // const point = new Point(FIRST_POINT_VALUE.x, FIRST_POINT_VALUE.y)
    const point = new Point(FIRST_POINT_VALUE)
    const FIRST_MUTATION_INDEX = 0
    const SECOND_MUTATION_INDEX = 1
    const THIRD_MUTATION_INDEX = 2
    const FOURTH_MUTATION_INDEX = 3
    const FIFTH_MUTATION_INDEX = 4
    it('should set x and y from constructor', () => {
        expect(point.val()).to.deep.equal(FIRST_POINT_VALUE)
    })

    it('should return history of mutations on the point after creation', () => {
        expect(point.mutations().length).to.equal(1)
        // TODO: ^^ Fix Violation of Law of Demeter
    } )

    // const firstMutation = point.mutations(FIRST_MUTATION_INDEX)
    it('first mutation should error on trying to be reversed, and point val should still be the same', () => {
        // expect(point.undo, FIRST_MUTATION_INDEX).to.throw(RangeError)
        expect(() => point.undo(FIRST_MUTATION_INDEX)).to.throw(RangeError)
        expect(point.val()).to.deep.equal(FIRST_POINT_VALUE)
    } )
    it(`should error on trying to be redo a mutation that hasn't
     been undone, and point val should still be the same`, () => {
        expect(() => point.redo(FIRST_MUTATION_INDEX)).to.throw(RangeError)
    } )
    it(`second mutation should change the point val
    to the second point val,
    and mutation result should have the result val`, () => {
        const mutation = {type: PointMutationTypes.SHIFT, timestamp: Date.now(), data: {delta: SECOND_MUTATION_VALUE}}
        point.addMutation(mutation)
        expect(point.mutations().length).to.equal(2)
        // TODO: ^^ Fix Violation of Law of Demeter
        expect(point.val()).to.deep.equal(SECOND_POINT_VALUE)
    })
    it(`should error on trying to be redo a mutation that hasn't
     been undone PT2, and point val should still be the same`, () => {
        expect(() => point.redo(FIRST_MUTATION_INDEX)).to.throw(RangeError)
    } )
    it(`undoing the second mutation should make point equivalent
     to the original value second mutation`, () => {
        point.undo(SECOND_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIRST_POINT_VALUE)
    })
    it(`redoing the second mutation should make point equivalent
     to the second point value`, () => {
        point.redo(SECOND_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(SECOND_POINT_VALUE)
    })
    it(`adding the third and fourth and fifth mutation should make the point
    equivalent to the fifth point value`, () => {
        const thirdMutation = {
            data: {delta: THIRD_MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        const fourthMutation = {
            data: {delta: FOURTH_MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        const fifthMutation = {
            data: {delta: FIFTH_MUTATION_VALUE},
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
        point.undo(SECOND_MUTATION_INDEX)
        point.undo(FOURTH_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIFTH_MINUS_2ND_AND_4TH_MUTATIONS_VALUE)
    })
    it(`redoing the second and fourth mutations should recalculate
     the state as the sum of the 1st, third, fourth, and 5th mutations`, () => {
        point.redo(FOURTH_MUTATION_INDEX)
        expect(point.val()).to.deep.equal(FIFTH_MINUS_2ND_MUTATION_VALUE)
    })
    it(`should error on trying to be redo a mutation that hasn't
     been undone (or that has been redone),
     and point val should still be the same`, () => {
        expect(() => point.redo(FOURTH_MUTATION_INDEX)).to.throw(RangeError)
    })
})
