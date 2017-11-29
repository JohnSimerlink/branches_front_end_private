import {expect} from 'chai'
import {IdMutationTypes} from './IdMutationTypes';
import {MutableId} from './MutableId';

describe('MutableId', () => {
    const INIT_ID = 'abc123'
    const NEW_ID = 'def456'
    const FIRST_SUCCESSFUL_MUTATION = {
        data: {id: NEW_ID}, timestamp: Date.now(), type: IdMutationTypes.SET
    }
    const id = new MutableId({id: INIT_ID})

    // TESTS with empty mutation history
    it(`INIT should setId
    AND set mutations length to 0`, () => {
        expect(id.val()).to.equal(INIT_ID)
        expect(id.mutations().length).to.equal(0)
    })
    it('ADD MUTATION SET should change Id' +
        'and increment num mutations', () => {
        id.addMutation(FIRST_SUCCESSFUL_MUTATION)
        expect(id.val()).to.deep.equal(NEW_ID)
        expect(id.mutations().length).to.equal(1)
    })
})
