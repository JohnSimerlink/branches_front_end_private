import 'reflect-metadata';
import test from 'ava';
import {
	IDbValable,
	IDetailedUpdates,
	IHash,
	IObjectFirebaseAutoSaver,
	ISubscribable,
	ISyncable,
	IValObject,
} from '../interfaces';
import {ObjectFirebaseAutoSaver} from './ObjectAutoFirebaseSaver';
import * as sinon from 'sinon';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';

test('start', (t) => {

	// onUpdate on each of the 4 properties should get called
	const name: ISubscribable<IDetailedUpdates> & IDbValable = {
		onUpdate() {
		},
		dbVal() {
			return 'Suzy';
		}
	};
	const age: ISubscribable<IDetailedUpdates> & IDbValable = {
		onUpdate() {
		},
		dbVal() {
			return 24;
		}
	};
	const person: ISyncable = {
		getPropertiesToSync() {
			return {
				name,
				age,
			};
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
	t.pass();

});

test('initialSave', (t) => {

	// onUpdate on each of the 4 properties should get called
	const name: ISubscribable<IDetailedUpdates> & IDbValable = {
		onUpdate() {
		},
		dbVal() {
			return 'Suzy';
		}
	};
	const age: ISubscribable<IDetailedUpdates> & IDbValable = {
		onUpdate() {
		},
		dbVal() {
			return 24;
		}
	};
	const person: ISyncable = {
		getPropertiesToSync() {
			return {
				name,
				age,
			};
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
	t.pass();

});
