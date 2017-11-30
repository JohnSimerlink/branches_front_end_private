import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {IUpdates} from '../dbSync/IUpdates';
import {updatesCallback} from '../ISubscribable';
import {IDatedMutation} from '../mutations/IMutation';
import {TYPES} from '../types';
import {IdMutationTypes} from './IdMutationTypes';
import {ISubscribableMutableId} from './ISubscribableMutableId';

describe('SubscribableMutableId', () => {
    it('Adding a mutation, should trigger an update for one of the subscribers [is this an integration test?]', () => {
        const subscribableMutableId = myContainer.get<ISubscribableMutableId>(TYPES.ISubscribableMutableId)
        const callback = sinon.spy() // (updates: IUpdates) => void 0
        const sampleMutation = myContainer.get<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation)
        subscribableMutableId.onUpdate(callback)
        subscribableMutableId.addMutation(sampleMutation)
        expect(callback.callCount).to.equal(1)
    })
})
