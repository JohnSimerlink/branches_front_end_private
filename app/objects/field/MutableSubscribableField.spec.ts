import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {FieldMutationTypes, IDatedMutation} from '../interfaces';
import {IMutableSubscribableField} from '../interfaces';
import {TYPES} from '../types';
import {MutableSubscribableField} from './MutableSubscribableField';

myContainerLoadAllModules({fakeSigma: true});
test('MutableSubscribableField > Subscribable::::Adding a mutation,' +
    ' should trigger an update for one of the subscribers [is this an integration test?]', (t) => {
    // const subscribableMutableId: IMutableSubscribableField =
    //     myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
    /* TODO: ^^^ USING THE ABOVE dependency injection fetcher fetches like an IDetailedUpdates branchesMap
    * and places it into the updatesCallbacks array, which causes a type error because ISubscribable
    * tries to invoke one of the updates, and the update is just an branchesMap not a function . . . .
    * */
    const subscribableMutableId: IMutableSubscribableField<string> = new MutableSubscribableField<string>();
    const callback = sinon.spy(); // (updates: IDetailedUpdates) => void 0
    expect(typeof callback).to.equal('function');
    const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IDatedMutation);
    subscribableMutableId.onUpdate(callback);
    subscribableMutableId.addMutation(sampleMutation);
    expect(callback.callCount).to.equal(1);
    t.pass()
});
const INIT_ID = 'abc123';
const NEW_ID = 'def456';
const FIRST_SUCCESSFUL_MUTATION = {
    data: NEW_ID, timestamp: Date.now(), type: FieldMutationTypes.SET
};
const id = new MutableSubscribableField<string>({field: INIT_ID});

// TESTS with empty mutation history
test(`SubscribableMutableField > MutableField::::INIT should setId
AND set mutations length to 0`, (t) => {
    expect(id.val()).to.equal(INIT_ID);
    expect(id.mutations().length).to.equal(0);
    t.pass()
});
test('MutableSubscribableField > MutableField::::ADD MUTATION SET should change Id ' +
    'and increment num mutations', (t) => {
    id.addMutation(FIRST_SUCCESSFUL_MUTATION);
    expect(id.val()).to.deep.equal(NEW_ID);
    expect(id.mutations().length).to.equal(1);
    t.pass()
});
