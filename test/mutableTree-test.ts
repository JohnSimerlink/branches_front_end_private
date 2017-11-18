import {expect} from 'chai'
import {PointMutationTypes} from '../app/objects/point/PointMutationTypes';
import {MutableTree} from '../app/objects/tree/MutableTree';
import {TreeMutationTypes} from '../app/objects/tree/TreeMutationTypes';

describe('UndoableMutableTree', () => {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    const FIRST_CHILD_ID = 'abc123'
    const SECOND_CHILD_ID = 'dfabc123'
    const THIRD_CHILD_ID = 'gfabc123'
    const FOURTH_CHILD_ID = 'hgabc123'
    const NONEXISTENT_CHILD_ID = 'nonexistentid'
    const INIT_CHILDREN_VALUE = []
    const FIRST_SUCCESSFUL_MUTATION = {
        data: {childId: FIRST_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const FIRST_CHILDREN_VALUE = [...INIT_CHILDREN_VALUE, FIRST_CHILD_ID]
    const SECOND_SUCCESSFUL_MUTATION = {
        data: {childId: FIRST_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.REMOVE_CHILD
    }
    const THIRD_SUCCESSFUL_MUTATION = FIRST_SUCCESSFUL_MUTATION
    THIRD_SUCCESSFUL_MUTATION.timestamp = Date.now()
    const FOURTH_SUCCESSFUL_MUTATION = {
        data: {childId: SECOND_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const FIFTH_SUCCESSFUL_MUTATION = {
        data: {childId: THIRD_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const SIXTH_SUCCESSFUL_MUTATION = {
        data: {childId: FOURTH_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const SEVENTH_SUCCESSFUL_MUTATION = {
        data: {childId: THIRD_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.REMOVE_CHILD
    }
    const childrenAfterSixthSuccessfulMutation = [
        ...FIRST_CHILDREN_VALUE,
        SECOND_CHILD_ID,
        THIRD_CHILD_ID,
        FOURTH_CHILD_ID
    ]
    const childrenAfterSeventhSuccessfulMutation = [
        ...FIRST_CHILDREN_VALUE,
        SECOND_CHILD_ID,
        FOURTH_CHILD_ID
    ]
    const firstAndFourthIds = [
        FIRST_CHILD_ID, FOURTH_CHILD_ID
    ]
    // ,SECOND_CHILD_ID, THIRD_CHILD_ID, FOURTH_CHILD_ID]
    const tree = new MutableTree()
    const FIRST_MUTATION_INDEX = 0
    const SECOND_MUTATION_INDEX = 1
    const THIRD_MUTATION_INDEX = 2
    const FOURTH_MUTATION_INDEX = 3
    const FIFTH_MUTATION_INDEX = 4
    it('INIT should have no children after constructor', () => {
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
    })

    it('INIT should return history of mutations on the point after creation', () => {
        expect(tree.mutations().length).to.equal(0)
        // TODO: ^^ Fix Violation of Law of Demeter
    } )
    it('GOOD ADD_CHILD mutation should add childId to children array and add entry to mutation history', () => {
        tree.addMutation(FIRST_SUCCESSFUL_MUTATION)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
    })

    it(`BAD ADD_CHILD mutation that tries adding a childId that already exists should throw a RangeError
    and keep the data and mutation values the same`, () => {
        const disallowedRedundantMutation = FIRST_SUCCESSFUL_MUTATION
        disallowedRedundantMutation.timestamp = Date.now()
        expect(() => tree.addMutation(disallowedRedundantMutation)).to.throw(RangeError)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
    })

    it(`BAD REMOVE_CHILD mutation on non-existent childId will throw range error
    and should keep data and mutations the same`
        , () => {
            const badRemoveMutation = {
                data: {childId: NONEXISTENT_CHILD_ID },
                timestamp: Date.now(),
                type: TreeMutationTypes.REMOVE_CHILD
            }

            expect(() => {tree.addMutation(badRemoveMutation)}).to.throw(RangeError)
            expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
            expect(tree.mutations().length).to.equal(1)
        })
    it(`GOOD REMOVE_CHILD mutation on existing childId will remove childId
    and should add another mutation`, () => {
        const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION

        tree.addMutation(goodRemoveMutation)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(2)
    })
    it(`BAD REMOVE_CHILD (2) mutation on non-existent childId will throw range error
    and should keep data and mutations the same`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        const badRemoveMutation = {
            data: {childId: FIRST_CHILD_ID },
            timestamp: Date.now(),
            type: TreeMutationTypes.REMOVE_CHILD
        }

        expect( () => tree.addMutation(badRemoveMutation)).to.throw(RangeError)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(2)
    })
    it(`GOOD ADD_CHILD mutation on a childId that has been removed by another mutation
    will simply append another ADD CHILD mutation
    and should increment mutations length`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION

        tree.addMutation(THIRD_SUCCESSFUL_MUTATION)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(3)
    })

    it(`3 GOOD ADD_CHILD mutations should increase the num children to 4,
    and num mutations to 6`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        tree.addMutation(FOURTH_SUCCESSFUL_MUTATION)
        tree.addMutation(FIFTH_SUCCESSFUL_MUTATION)
        tree.addMutation(SIXTH_SUCCESSFUL_MUTATION)

        expect(tree.getChildIds()).to.deep.equal(childrenAfterSixthSuccessfulMutation)
        expect(tree.mutations().length).to.equal(6)
    })
    it(`GOOD REMOVE_CHILD mutation should decrease the num children to 3,
    and num mutations to 7`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        tree.addMutation(SEVENTH_SUCCESSFUL_MUTATION)

        expect(tree.getChildIds()).to.deep.equal(childrenAfterSeventhSuccessfulMutation)
        expect(tree.mutations().length).to.equal(7)
    })

})
