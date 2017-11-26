import {expect} from 'chai'
import * as sinon from 'sinon'
import {SyncToFirebase} from './dbSync/SyncToFirebase';
import {IUpdates} from './dbSync/IUpdates';
import {IDatedMutation} from './mutations/IMutation';
import {SubscribableMutableStringSet} from './set/SubscribableMutableStringSet';
import {SetMutationTypes} from './set/SetMutationTypes';

describe('Subscribable:SubscribableMutableStringSet', () => {
    const updatesCallbacks = []
    const set = new SubscribableMutableStringSet({updatesCallbacks})
    // const firebaseRef = 'path/subpath/prop'
    // const firebaseSyncer = new SyncToFirebase({firebaseRef})

    const callback1 = sinon.spy() // () => void 0
    const callback2 = sinon.spy() // () => void 0
    it('Subscribable:mutableStringSet onUpdate func should add func to callback list', () => {
        set.onUpdate(callback1) // TODO: why doesn't typescript complain that func is not of type updatesCallback?
        expect(updatesCallbacks).to.deep.equal([callback1])
    })
    it(`Subscribable:mutableStringSet addMutation should call
     all the callbacks with the expected published updates`, () => {
        set.onUpdate(callback2) // TODO: why doesn't typescript complain that func is not of type updatesCallback?
        const ADDED_KEY = '123'
        const mutation: IDatedMutation<SetMutationTypes> = {
            data: ADDED_KEY,
            timestamp: Date.now(),
            type: SetMutationTypes.ADD,
        }
        set.addMutation(mutation)
        const val = {}
        val[ADDED_KEY] = true

        const expectedPublishedUpdates: IUpdates = {
            pushes: {
                mutations: mutation
            },
            updates: {
                val
            }
        }
        expect(callback1.callCount).to.equal(1)
        expect(callback2.callCount).to.equal(1)
        expect(callback1.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates)
        expect(callback2.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates)
    })
    // firebaseSyncer.subscribe(set)
    // const saveSpy = sinon.spy(firebaseSyncer._test_save
    // const mutation = {}
    // set.addMutation()

})
