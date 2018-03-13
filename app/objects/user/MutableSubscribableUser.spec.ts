import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    CONTENT_TYPES, UserPropertyNames, FieldMutationTypes, IDatedMutation,
    IProppedDatedMutation, ISyncableMutableSubscribableUser, timestamp
} from '../interfaces';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableUser} from './MutableSubscribableUser';
import {SyncableMutableSubscribableUser} from './SyncableMutableSubscribableUser';
import {sampleUser1, sampleUserData1, sampleUserDataFromDB1, sampleUserData1ExpirationDate} from "../../objects/user/UserTestHelpers";

myContainerLoadAllModules();
test('MutableSubscribableUser:::a mutation in one of the subscribable properties' +
    ' should publish an update of the entire branchesMap\'s value '
    + ' after startPublishing has been called', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const user: ISyncableMutableSubscribableUser = sampleUser1;

    user.startPublishing();

    const callback = sinon.spy();
    user.onUpdate(callback);

    const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IProppedDatedMutation);
    // question.addMutation(sampleMutation)
    // const newUserDataValue = user.val()
    // const calledWith = callback.getCall(0).args[0]
    // expect(callback.callCount).to.equal(1)
    // expect(calledWith).to.deep.equal(newUserDataValue)
    t.pass()
});
test('MutableSubscribableUser:::a mutation in one of the subscribable properties' +
    ' should NOT publish an update of the entire branchesMap\'s value'
    + ' before startPublishing has been called', (t) => {

    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const user: ISyncableMutableSubscribableUser = sampleUser1;

    const callback = sinon.spy();
    user.onUpdate(callback);

    expect(callback.callCount).to.equal(0);
    t.pass()
});
test('MutableSubscribableUser:::addMutation ' +
    ' should call addMutation on the appropriate descendant property' +
    'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {

    const user: ISyncableMutableSubscribableUser = sampleUser1;

    const membershipExpirationAddMutationSpy = sinon.spy(sampleUserData1ExpirationDate, 'addMutation');

    // tslint:disable variable-name
    const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
        data: 'What is the capital of California?',
        timestamp: Date.now(),
        type: FieldMutationTypes.SET
    };
    const mutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> = {
        ...mutationWithoutPropName,
        propertyName: UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE,
    };

    user.addMutation(mutation);
    expect(membershipExpirationAddMutationSpy.callCount).to.equal(1);
    const calledWith = membershipExpirationAddMutationSpy.getCall(0).args[0];
    expect(calledWith).to.deep.equal(mutationWithoutPropName);
    t.pass()

});
