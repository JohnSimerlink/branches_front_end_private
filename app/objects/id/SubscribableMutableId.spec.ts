import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IDatedMutation} from '../mutations/IMutation';
import {TYPES} from '../types';
import {IdMutationTypes} from './IdMutationTypes';
import {ISubscribableMutableId} from './ISubscribableMutableId';
import {SubscribableMutableId} from './SubscribableMutableId';

describe('SubscribableMutableId > Subscribable', () => {
    it('Adding a mutation, should trigger an update for one of the subscribers [is this an integration test?]', () => {
        // const subscribableMutableId: ISubscribableMutableId =
        //     myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        /* TODO: ^^^ USING THE ABOVE dependency injection fetcher fetches like an IUpdates object
        * and places it into the updatesCallbacks array, which causes a type error because ISubscribable
        * tries to invoke one of the updates, and the update is just an object not a function . . . .
        * */
        const subscribableMutableId: ISubscribableMutableId = new SubscribableMutableId()
        const callback = sinon.spy() // (updates: IUpdates) => void 0
        expect(typeof callback).to.equal('function')
        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation)
        subscribableMutableId.onUpdate(callback)
        subscribableMutableId.addMutation(sampleMutation)
        expect(callback.callCount).to.equal(1)
    })
})
describe('SubscribableMutableId > MutableId', () => {
    const INIT_ID = 'abc123'
    const NEW_ID = 'def456'
    const FIRST_SUCCESSFUL_MUTATION = {
        data: {id: NEW_ID}, timestamp: Date.now(), type: IdMutationTypes.SET
    }
    const id = new SubscribableMutableId({id: INIT_ID})

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
