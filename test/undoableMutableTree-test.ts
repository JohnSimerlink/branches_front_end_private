import {expect} from 'chai'
import {PointMutationTypes} from '../app/objects/point/PointMutationTypes';
import {TreeMutationTypes} from '../app/objects/tree/TreeMutationTypes';
import {UndoableMutableTree} from '../app/objects/tree/UndoableMutableTree';

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
    const THIRD_SUCCESSFUL_MUTATION = {
        data: {childId: SECOND_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const FOURTH_SUCCESSFUL_MUTATION = {
        data: {childId: THIRD_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const FIFTH_SUCCESSFUL_MUTATION = {
        data: {childId: FOURTH_CHILD_ID}, timestamp: Date.now(), type: TreeMutationTypes.ADD_CHILD
    }
    const childrenAfterFifthSuccessfulMutation = [
        ...FIRST_CHILDREN_VALUE,
        SECOND_CHILD_ID,
        THIRD_CHILD_ID,
        FOURTH_CHILD_ID
    ]
    const firstAndFourthIds = [
        FIRST_CHILD_ID, FOURTH_CHILD_ID
    ]
    // ,SECOND_CHILD_ID, THIRD_CHILD_ID, FOURTH_CHILD_ID]
    const tree = new UndoableMutableTree()
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
    it('BAD UNDO should RangeError on trying to undo a non-existent mutation and negative mutationIndices', () => {
        expect(() => tree.undo(-1)).to.throw(RangeError)
        expect(() => tree.undo(0)).to.throw(RangeError)
        expect(() => tree.undo(1)).to.throw(RangeError)
        expect(() => tree.undo(3)).to.throw(RangeError)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(0)
    })

    it('BAD REDO should RangeError on trying to redo a non-existent mutation and negative mutationIndices', () => {
        expect(() => tree.redo(-1)).to.throw(RangeError)
        expect(() => tree.redo(0)).to.throw(RangeError)
        expect(() => tree.redo(1)).to.throw(RangeError)
        expect(() => tree.redo(3)).to.throw(RangeError)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(0)
    })

    it('GOOD ADD_CHILD mutation should add childId to children array and add entry to mutation history', () => {
        tree.addMutation(FIRST_SUCCESSFUL_MUTATION)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
    })

    it(`GOOD UNDO ADD_CHILD mutation should remove childId
     from children array and keep mutation list length the same`, () => {
        tree.undo(FIRST_MUTATION_INDEX)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
    })

    it(`GOOD REDO ADD_CHILD mutation should add childId
     back into children array and keep mutation list length the same`, () => {
        tree.redo(FIRST_MUTATION_INDEX)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
    })

    it(`BAD REDO ADD_CHILD mutation on a mutation that was just redone should throw RangeError
    and keep the data and mutation values the same`, () => {
        expect(() => tree.redo(FIRST_MUTATION_INDEX)).to.throw(RangeError)
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

    it(`ADD_CHILD mutation that tries adding a childId that was already added via a mutation
     (but that mutation has been undone), will redo that mutation
     rather than throwing an Error.
     And will thereby keep mutation list same length
     `, () => {
        const allowedRedundantMutation = {
            data: {childId: FIRST_CHILD_ID},
            timestamp: Date.now(),
            type: TreeMutationTypes.ADD_CHILD
        }

        tree.undo(FIRST_MUTATION_INDEX)
        expect(tree.getChildIds()).to.deep.equal(INIT_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(1)
        tree.addMutation(allowedRedundantMutation)
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
    /* TODO:
        Should we get rid of REMOVE_CHILD mutation, and just have an UNDO of the ADD_CHILD mutation?
        I personally don't think so, because perhaps the tree could have been initialized with some children
        without ever adding the children via mutations
        meaning if you wanted to get rid of the children, you'd have to call
        REMOVE_MUTATION, because there'd be no ADD_MUTATION to undo
     */
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
    it(`GOOD ADD_CHILD mutation on a childId that has been removed by another mutation will disable that mutation
    and should keep mutations length the same`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        const addSameChildSecondTime = FIRST_SUCCESSFUL_MUTATION
        addSameChildSecondTime.timestamp = Date.now()

        tree.addMutation(addSameChildSecondTime)
        expect(tree.getChildIds()).to.deep.equal(FIRST_CHILDREN_VALUE)
        expect(tree.mutations().length).to.equal(2)
    })

    it(`3 GOOD ADD_CHILD mutations should increase the num children to 4,
    and num mutations to 5`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        tree.addMutation(THIRD_SUCCESSFUL_MUTATION)
        tree.addMutation(FOURTH_SUCCESSFUL_MUTATION)
        tree.addMutation(FIFTH_SUCCESSFUL_MUTATION)

        expect(tree.getChildIds()).to.deep.equal(childrenAfterFifthSuccessfulMutation)
        expect(tree.mutations().length).to.equal(5)
    })

    it(`2 GOOD UNDO mutations should decrease the num children to 2,
    and keep num mutations at 5`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        tree.undo(FIRST_MUTATION_INDEX)
        tree.undo(FOURTH_MUTATION_INDEX)

        expect(tree.getChildIds()).to.deep.equal(firstAndFourthIds)
        expect(tree.mutations().length).to.equal(5)
    })

})
