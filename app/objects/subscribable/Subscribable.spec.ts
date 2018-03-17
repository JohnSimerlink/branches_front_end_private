import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {IDatedMutation, IDetailedUpdates, SetMutationTypes} from '../interfaces';
import {MutableSubscribableStringSet} from '../set/SubscribableMutableStringSet';

injectFakeDom();

const updatesCallbacks = [];
const set = new MutableSubscribableStringSet({updatesCallbacks});
// const treeLocationsFirebaseRef = 'path/subpath/prop'
// const firebaseSyncer = new PropertyAutoFirebaseSaver({treeLocationsFirebaseRef})

const callback1 = sinon.spy(); // () => void 0
const callback2 = sinon.spy(); // () => void 0
test('Subscribable:MutableSubscribableStringSet:::' +
    'Subscribable:mutableStringSet onUpdate func should add func to callback list', (t) => {
    set.onUpdate(callback1); // TODO: why doesn't typescript complain that func is not of type IUpdatesCallback?
    expect(updatesCallbacks).to.deep.equal([callback1]);
    t.pass();
});
test(`Subscribable:mutableStringSet addMutation should call
 all the callbacks with the expected published updates`, (t) => {
    set.onUpdate(callback2); // TODO: why doesn't typescript complain that func is not of type IUpdatesCallback?
    const ADDED_KEY = '123';
    const mutation: IDatedMutation<SetMutationTypes> = {
        data: ADDED_KEY,
        timestamp: Date.now(),
        type: SetMutationTypes.ADD,
    };
    set.addMutation(mutation);
    const val = {};
    val[ADDED_KEY] = true;

    const expectedPublishedUpdates: IDetailedUpdates = {
        pushes: {
            mutations: mutation
        },
        updates: {
            val
        }
    };
    expect(callback1.callCount).to.equal(1);
    expect(callback2.callCount).to.equal(1);
    expect(callback1.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates);
    expect(callback2.firstCall.args[0]).to.deep.equal(expectedPublishedUpdates);
    t.pass();
});
// firebaseSyncer.subscribe(set)
// const saveSpy = sinon.spy(firebaseSyncer._test_save
// const mutation = {}
// set.addMutation()
