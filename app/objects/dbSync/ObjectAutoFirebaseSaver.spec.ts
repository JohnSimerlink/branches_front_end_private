import 'reflect-metadata'
import test from 'ava'
import {IDetailedUpdates, IFirebaseRef, IObjectFirebaseAutoSaver, ISubscribable, ISyncableObject} from '../interfaces';
import {ObjectFirebaseAutoSaver} from './ObjectAutoFirebaseSaver';
import {FirebaseRef} from './FirebaseRef';
import * as sinon from 'sinon'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'

test('start', () => {

    // onUpdate on each of the 4 properties should get called
    const name: ISubscribable<IDetailedUpdates> = {
        onUpdate() {}
    }
    const age: ISubscribable<IDetailedUpdates> = {
        onUpdate() {}
    }
    const person: ISyncableObject = {
        getPropertiesToSync() {
            return {
                name,
                age,
            }
        }
    }

    const personFirebaseRef = new MockFirebase('people/1')
    const objectAutoFirebaseSaver: IObjectFirebaseAutoSaver = new ObjectFirebaseAutoSaver({
        syncableObject: person,
        syncableObjectFirebaseRef: personFirebaseRef
    })

    const nameOnUpdateSpy = sinon.spy(name, 'onUpdate')
    const ageOnUpdateSpy = sinon.spy(age, 'onUpdate')

    objectAutoFirebaseSaver.start()

    expect(nameOnUpdateSpy.callCount).to.equal(1)
    expect(ageOnUpdateSpy.callCount).to.equal(1)

})
