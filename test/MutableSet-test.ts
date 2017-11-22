import {expect} from 'chai'
import {SubscribableMutableStringSet} from '../app/objects/set/SubscribableMutableStringSet';
import {SetMutationTypes} from '../app/objects/set/SetMutationTypes';

describe('MutableSet:string', () => {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    const FIRST_MEMBER_ID = 'abc123'
    const SECOND_MEMBER_ID = 'dfabc123'
    const THIRD_MEMBER_ID = 'gfabc123'
    const FOURTH_MEMBER_ID = 'hgabc123'
    const NONEXISTENT_MEMBER_ID = 'nonexistentid'
    const INIT_MEMBER_VALUE = []
    const FIRST_SUCCESSFUL_MUTATION = {
        data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
    }
    const FIRST_MEMBER_VALUE = [...INIT_MEMBER_VALUE, FIRST_MEMBER_ID]
    const SECOND_SUCCESSFUL_MUTATION = {
        data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.REMOVE
    }
    const THIRD_SUCCESSFUL_MUTATION = FIRST_SUCCESSFUL_MUTATION
    THIRD_SUCCESSFUL_MUTATION.timestamp = Date.now()
    const FOURTH_SUCCESSFUL_MUTATION = {
        data: SECOND_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
    }
    const FIFTH_SUCCESSFUL_MUTATION = {
        data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
    }
    const SIXTH_SUCCESSFUL_MUTATION = {
        data: FOURTH_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
    }
    const SEVENTH_SUCCESSFUL_MUTATION = {
        data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.REMOVE
    }
    const membersAfterSixthSuccessfulMutation = [
        ...FIRST_MEMBER_VALUE,
        SECOND_MEMBER_ID,
        THIRD_MEMBER_ID,
        FOURTH_MEMBER_ID
    ]
    const membersAfterSeventhSuccessfulMutation = [
        ...FIRST_MEMBER_VALUE,
        SECOND_MEMBER_ID,
        FOURTH_MEMBER_ID
    ]
    const firstAndFourthIds = [
        FIRST_MEMBER_ID, FOURTH_MEMBER_ID
    ]
    // ,SECOND_MEMBER_ID, THIRD_MEMBER_ID, FOURTH_MEMBER_ID]
    const stringSet = new SubscribableMutableStringSet()
    const FIRST_MUTATION_INDEX = 0
    const SECOND_MUTATION_INDEX = 1
    const THIRD_MUTATION_INDEX = 2
    const FOURTH_MUTATION_INDEX = 3
    const FIFTH_MUTATION_INDEX = 4
    it('INIT should have no members after constructor', () => {
        expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE)
    })

    it('INIT should return history of mutations on the point after creation', () => {
        expect(stringSet.mutations().length).to.equal(0)
        // TODO: ^^ Fix Violation of Law of Demeter
    } )
    it('GOOD ADD mutation should add member to members array and add entry to mutation history', () => {
        stringSet.addMutation(FIRST_SUCCESSFUL_MUTATION)
        expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE)
        expect(stringSet.mutations().length).to.equal(1)
    })

    it(`BAD ADD mutation that tries adding a member that already exists should throw a RangeError
    and keep the data and mutation values the same`, () => {
        const disallowedRedundantMutation = FIRST_SUCCESSFUL_MUTATION
        disallowedRedundantMutation.timestamp = Date.now()
        expect(() => stringSet.addMutation(disallowedRedundantMutation)).to.throw(RangeError)
        expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE)
        expect(stringSet.mutations().length).to.equal(1)
    })

    it(`BAD REMOVE mutation on non-existent member will throw range error
    and should keep data and mutations the same`
        , () => {
            const badRemoveMutation = {
                data: NONEXISTENT_MEMBER_ID,
                timestamp: Date.now(),
                type: SetMutationTypes.REMOVE
            }

            expect(() => {stringSet.addMutation(badRemoveMutation)}).to.throw(RangeError)
            expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE)
            expect(stringSet.mutations().length).to.equal(1)
        })
    it(`GOOD REMOVE mutation on existing member will remove member
    and should add another mutation`, () => {
        const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION

        stringSet.addMutation(goodRemoveMutation)
        expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE)
        expect(stringSet.mutations().length).to.equal(2)
    })
    it(`BAD REMOVE (2) mutation on non-existent member will throw range error
    and should keep data and mutations the same`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        const badRemoveMutation = {
            data: FIRST_MEMBER_ID,
            timestamp: Date.now(),
            type: SetMutationTypes.REMOVE
        }

        expect( () => stringSet.addMutation(badRemoveMutation)).to.throw(RangeError)
        expect(stringSet.getMembers()).to.deep.equal(INIT_MEMBER_VALUE)
        expect(stringSet.mutations().length).to.equal(2)
    })
    it(`GOOD ADD mutation on a member that has been removed by another mutation
    will simply append another ADD MEMBER mutation
    and should increment mutations length`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION

        stringSet.addMutation(THIRD_SUCCESSFUL_MUTATION)
        expect(stringSet.getMembers()).to.deep.equal(FIRST_MEMBER_VALUE)
        expect(stringSet.mutations().length).to.equal(3)
    })

    it(`3 GOOD ADD mutations should increase the num members to 4,
    and num mutations to 6`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        stringSet.addMutation(FOURTH_SUCCESSFUL_MUTATION)
        stringSet.addMutation(FIFTH_SUCCESSFUL_MUTATION)
        stringSet.addMutation(SIXTH_SUCCESSFUL_MUTATION)

        expect(stringSet.getMembers()).to.deep.equal(membersAfterSixthSuccessfulMutation)
        expect(stringSet.mutations().length).to.equal(6)
    })
    it(`GOOD REMOVE mutation should decrease the num members to 3,
    and num mutations to 7`, () => {
        // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
        stringSet.addMutation(SEVENTH_SUCCESSFUL_MUTATION)

        expect(stringSet.getMembers()).to.deep.equal(membersAfterSeventhSuccessfulMutation)
        expect(stringSet.mutations().length).to.equal(7)
    })
    // TODO: do tests with injecting a mutations array that is not empty

})
