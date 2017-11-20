import {expect} from 'chai'
import {IdMutationTypes} from '../app/objects/tree/IdMutationTypes';
import {MutableId} from '../app/objects/tree/MutableId';
import {TreeParentMutationTypes} from '../app/objects/tree/TreeParentMutationTypes';

describe('MutableId', () => {
    // FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
    // const po = new Point({x:5, y:6})
    const INIT_PARENT_ID = 'abc123'
    const NEW_PARENT_ID = 'def456'
    // const SECOND_NEW_PARENT_ID = 'df1abc123'
    // const THIRD_NEW_PARENT_ID = 'f31aabc123'
    // const FOURTH_NEW_PARENT_ID = '35dfabc123'
    const SECOND_SUCCESSFUL_MUTATION = {
        data: {id: NEW_PARENT_ID}, timestamp: Date.now(), type: IdMutationTypes.SET
    }
    // const THIRD_SUCCESSFUL_MUTATION = {
    //     data: {id: SECOND_NEW_PARENT_ID}, timestamp: Date.now(), type: TreeParentMutationTypes.SET_ID
    // }
    // const FOURTH_SUCCESSFUL_MUTATION = {
    //     data: {id: THIRD_NEW_PARENT_ID}, timestamp: Date.now(), type: TreeParentMutationTypes.SET_ID
    // }
    const id = new MutableId({id: INIT_PARENT_ID})

    // TESTS with empty mutation history
    it(`INIT should setId
    AND set mutations length to 0`, () => {
        expect(id.get()).to.equal(INIT_PARENT_ID)
        expect(id.mutations().length).to.equal(0)
    })
    it('ADD MUTATION SET should change Id' +
        'and increment num mutations', () => {
        id.addMutation(SECOND_SUCCESSFUL_MUTATION)
        expect(id.get()).to.deep.equal(NEW_PARENT_ID)
        expect(id.mutations().length).to.equal(1)
    })
})
