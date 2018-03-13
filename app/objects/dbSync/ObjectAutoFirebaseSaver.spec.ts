import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
/* ^^ TODO: BAD_DESIGN: Why do I have to import injectFakeDom and run it to make my test pass????
 This unit test should have NOTHING TODO with the DOM.
  I must have some poorly designed dependency injection or something
 */
import 'reflect-metadata'
import test from 'ava'
import {
    IDetailedUpdates, IObjectFirebaseAutoSaver, ISubscribable, ISyncableValable,
    IValable,
    ISyncable, IValObject, IHash, IDbValable,
} from '../interfaces';
import {ObjectFirebaseAutoSaver} from './ObjectAutoFirebaseSaver';
import * as sinon from 'sinon'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import {myContainerLoadAllModules} from '../../../inversify.config';

myContainerLoadAllModules({fakeSigma: true});
test('start', (t) => {

    // onUpdate on each of the 4 properties should get called
    const name: ISubscribable<IDetailedUpdates> & IDbValable = {
        onUpdate() {},
        dbVal() { return 'Suzy'}
    };
    const age: ISubscribable<IDetailedUpdates> & IDbValable = {
        onUpdate() {},
        dbVal() { return 24}
    };
    const person: ISyncable = {
        getPropertiesToSync() {
            return {
                name,
                age,
            }
        },
    };

    const personFirebaseRef = new MockFirebase('people/1');
    const objectAutoFirebaseSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
        syncableObject: person,
        syncableObjectFirebaseRef: personFirebaseRef
    });

    const nameOnUpdateSpy = sinon.spy(name, 'onUpdate');
    const ageOnUpdateSpy = sinon.spy(age, 'onUpdate');

    objectAutoFirebaseSaver.start();

    expect(nameOnUpdateSpy.callCount).to.equal(1);
    expect(ageOnUpdateSpy.callCount).to.equal(1);
    t.pass()

});

test('initialSave', (t) => {

    // onUpdate on each of the 4 properties should get called
    const name: ISubscribable<IDetailedUpdates> & IDbValable = {
        onUpdate() {},
        dbVal() { return 'Suzy'}
    };
    const age: ISubscribable<IDetailedUpdates> & IDbValable = {
        onUpdate() {},
        dbVal() { return 24}
    };
    const person: ISyncable = {
        getPropertiesToSync() {
            return {
                name,
                age,
            }
        },
    };
    const personInitialSaveValue: IHash<IValObject> = {
        name: {
            val: name.dbVal(),
        },
        age: {
            val: age.dbVal(),
        }
    };

    const personFirebaseRef = new MockFirebase('people/1');
    const objectAutoFirebaseSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
        syncableObject: person,
        syncableObjectFirebaseRef: personFirebaseRef
    });

    const personFirebaseRefOnUpdateSpy = sinon.spy(personFirebaseRef, 'update');

    objectAutoFirebaseSaver.initialSave();

    expect(personFirebaseRefOnUpdateSpy.callCount).to.equal(1);
    const calledWith = personFirebaseRefOnUpdateSpy.getCall(0).args[0];
    expect(calledWith).to.deep.equal(personInitialSaveValue);
    t.pass()

});
