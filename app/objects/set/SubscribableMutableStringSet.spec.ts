import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon from 'sinon';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {IDatedMutation, SetMutationTypes} from '../interfaces';
import {TYPES} from '../types';
import {MutableSubscribableStringSet} from './SubscribableMutableStringSet';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
// FIRST_SUCCESSFUL_MUTATIONis {x: 5, y: 7}
// const po = new Point({x:5, y:6})
const FIRST_MEMBER_ID = 'abc123';
const SECOND_MEMBER_ID = 'dfabc123';
const THIRD_MEMBER_ID = 'gfabc123';
const FOURTH_MEMBER_ID = 'hgabc123';
const NONEXISTENT_MEMBER_ID = 'nonexistentid';
const INIT_MEMBER_VALUE = [];
const FIRST_SUCCESSFUL_MUTATION = {
    data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
};
const FIRST_MEMBER_VALUE = [...INIT_MEMBER_VALUE, FIRST_MEMBER_ID];
const SECOND_SUCCESSFUL_MUTATION = {
    data: FIRST_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.REMOVE
};
const THIRD_SUCCESSFUL_MUTATION = FIRST_SUCCESSFUL_MUTATION;
THIRD_SUCCESSFUL_MUTATION.timestamp = Date.now();
const FOURTH_SUCCESSFUL_MUTATION = {
    data: SECOND_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
};
const FIFTH_SUCCESSFUL_MUTATION = {
    data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
};
const SIXTH_SUCCESSFUL_MUTATION = {
    data: FOURTH_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.ADD
};
const SEVENTH_SUCCESSFUL_MUTATION = {
    data: THIRD_MEMBER_ID, timestamp: Date.now(), type: SetMutationTypes.REMOVE
};
const membersAfterSixthSuccessfulMutation = [
    ...FIRST_MEMBER_VALUE,
    SECOND_MEMBER_ID,
    THIRD_MEMBER_ID,
    FOURTH_MEMBER_ID
];
const membersAfterSeventhSuccessfulMutation = [
    ...FIRST_MEMBER_VALUE,
    SECOND_MEMBER_ID,
    FOURTH_MEMBER_ID
];
const firstAndFourthIds = [
    FIRST_MEMBER_ID, FOURTH_MEMBER_ID
];
// ,SECOND_MEMBER_ID, THIRD_MEMBER_ID, FOURTH_MEMBER_ID]
const stringSet = new MutableSubscribableStringSet();
const FIRST_MUTATION_INDEX = 0;
const SECOND_MUTATION_INDEX = 1;
const THIRD_MUTATION_INDEX = 2;
const FOURTH_MUTATION_INDEX = 3;
const FIFTH_MUTATION_INDEX = 4;
test('MutableSubscribableStringSet > IMutable, ISet :string::::::' +
    'INIT should have no members after constructor', (t) => {
    expect(stringSet.val()).to.deep.equal(INIT_MEMBER_VALUE);
    t.pass();
});

test('MutableSubscribableStringSet > IMutable, ISet :string::::::' +
    'INIT should return history of mutations on the point after creation', (t) => {
    expect(stringSet.mutations().length).to.equal(0);
    t.pass();
    // TODO: ^^ Fix Violation of Law of Demeter
} );
test('MutableSubscribableStringSet > IMutable, ISet :string::::::' +
    'GOOD ADD mutation should add member to members array and add entry to mutation history', (t) => {
    stringSet.addMutation(FIRST_SUCCESSFUL_MUTATION);
    expect(stringSet.val()).to.deep.equal(FIRST_MEMBER_VALUE);
    expect(stringSet.mutations().length).to.equal(1);
    t.pass();
});

test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
BAD ADD mutation that tries adding a member that already exists should throw a RangeError
and keep the data and mutation values the same`, (t) => {
    const disallowedRedundantMutation = FIRST_SUCCESSFUL_MUTATION;
    disallowedRedundantMutation.timestamp = Date.now();
    expect(() => stringSet.addMutation(disallowedRedundantMutation)).to.throw(RangeError);
    expect(stringSet.val()).to.deep.equal(FIRST_MEMBER_VALUE);
    expect(stringSet.mutations().length).to.equal(1);
    t.pass();
});

test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
BAD REMOVE mutation on non-existent member will throw range error
and should keep data and mutations the same`
    , (t) => {
        const badRemoveMutation = {
            data: NONEXISTENT_MEMBER_ID,
            timestamp: Date.now(),
            type: SetMutationTypes.REMOVE
        };

        expect(() => {stringSet.addMutation(badRemoveMutation);}).to.throw(RangeError);
        expect(stringSet.val()).to.deep.equal(FIRST_MEMBER_VALUE);
        expect(stringSet.mutations().length).to.equal(1);
        t.pass();
    });
test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
GOOD REMOVE mutation on existing member will remove member
and should add another mutation`, (t) => {
    const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION;

    stringSet.addMutation(goodRemoveMutation);
    expect(stringSet.val()).to.deep.equal(INIT_MEMBER_VALUE);
    expect(stringSet.mutations().length).to.equal(2);
    t.pass();
});
test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
BAD REMOVE (2) mutation on non-existent member will throw range error
and should keep data and mutations the same`, (t) => {
    // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
    const badRemoveMutation = {
        data: FIRST_MEMBER_ID,
        timestamp: Date.now(),
        type: SetMutationTypes.REMOVE
    };

    expect( () => stringSet.addMutation(badRemoveMutation)).to.throw(RangeError);
    expect(stringSet.val()).to.deep.equal(INIT_MEMBER_VALUE);
    expect(stringSet.mutations().length).to.equal(2);
    t.pass();
});
test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
GOOD ADD mutation on a member that has been removed by another mutation
will simply append another ADD MEMBER mutation
and should increment mutations length`, (t) => {
    // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION

    stringSet.addMutation(THIRD_SUCCESSFUL_MUTATION);
    expect(stringSet.val()).to.deep.equal(FIRST_MEMBER_VALUE);
    expect(stringSet.mutations().length).to.equal(3);
    t.pass();
});

test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
3 GOOD ADD mutations should increase the num members to 4,
and num mutations to 6`, (t) => {
    // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
    stringSet.addMutation(FOURTH_SUCCESSFUL_MUTATION);
    stringSet.addMutation(FIFTH_SUCCESSFUL_MUTATION);
    stringSet.addMutation(SIXTH_SUCCESSFUL_MUTATION);

    expect(stringSet.val()).to.deep.equal(membersAfterSixthSuccessfulMutation);
    expect(stringSet.mutations().length).to.equal(6);
    t.pass();
});
test(`SubscribableMutableStringSet > IMutable, ISet :string::::::
GOOD REMOVE mutation should decrease the num members to 3,
and num mutations to 7`, (t) => {
    // const goodRemoveMutation = SECOND_SUCCESSFUL_MUTATION
    stringSet.addMutation(SEVENTH_SUCCESSFUL_MUTATION);

    expect(stringSet.val()).to.deep.equal(membersAfterSeventhSuccessfulMutation);
    expect(stringSet.mutations().length).to.equal(7);
    t.pass();
});
    // TODO: do tests with injecting a mutations array that is not empty

    /* subscribable capabilities already tested in subscribable base class.
     But I will retest here as a sort of integration test
    */
test('MutableSubscribableStringSet > Subscribable:::Adding a mutation, ' +
    'should trigger an update for one of the subscribers ', (t) => {
    const subscribableMutableStringSet = new MutableSubscribableStringSet();
    const callback = sinon.spy(); // (updates: IDetailedUpdates) => void 0
    const sampleMutation = myContainer.get<IDatedMutation<SetMutationTypes>>(TYPES.IDatedSetMutation);
    subscribableMutableStringSet.onUpdate(callback);
    subscribableMutableStringSet.addMutation(sampleMutation);
    expect(callback.callCount).to.equal(1);
    t.pass();
});
test('MutableSubscribableStringSet > Subscribable:::Adding a mutation,' +
    ' should trigger an update for multiple subscribers ', (t) => {
    const subscribableMutableStringSet = new MutableSubscribableStringSet();
    const callback1 = sinon.spy(); // (updates: IDetailedUpdates) => void 0
    const callback2 = sinon.spy(); // (updates: IDetailedUpdates) => void 0
    const sampleMutation = myContainer.get<IDatedMutation<SetMutationTypes>>(TYPES.IDatedSetMutation);
    subscribableMutableStringSet.onUpdate(callback1);
    subscribableMutableStringSet.onUpdate(callback2);
    subscribableMutableStringSet.addMutation(sampleMutation);
    expect(callback1.callCount).to.equal(1);
    expect(callback2.callCount).to.equal(1);
    t.pass();
});
