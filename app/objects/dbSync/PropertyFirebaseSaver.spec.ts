import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {IDetailedUpdates, } from '../interfaces';
import {TYPES} from '../types';
import {PropertyFirebaseSaver} from './PropertyFirebaseSaver';
import {MockFirebase} from 'firebase-mock'
// const treeLocationsFirebaseRef = 'path/subpath/prop'
// const
let firebaseRef
let firebaseRefUpdateSpy
let firebaseRefChildSpy
let propertyFirebaseSaver
let updatesObj: IDetailedUpdates
test.beforeEach(() => {
    firebaseRef = new MockFirebase()
    firebaseRefUpdateSpy = sinon.spy(firebaseRef, 'update')
    firebaseRefChildSpy = sinon.spy(firebaseRef, 'child')
    // const saveUpdatesToDBFunction = myContainer.val<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
    propertyFirebaseSaver = new PropertyFirebaseSaver({firebaseRef})
})
// TODO: test the constructor to ensure it takes into account the treeLocationsFirebaseRef

/* so i need to test if subscribe works
todo that I could 1) check if numSubscribers on the ISubscribable increases after subscribe.
 But that would be inspecting on a different branchesMap, making this an integration, not a unit test.
 And numSubscribers is a privated variable. Actually it doesn't even exist.
  2) call callCallbacks on the Subscribable and see if that calls firebaseSyncer's private save method . . .
  but that would be unit testing a private method . . .
*/

myContainerLoadAllModules({fakeSigma: true})
test(`IDatabaseSaver > PropertyFirebaseSaver::::save updates with updates and no pushes should call the propertyFirebaseSaver's
     update method once, and child().push() method 0 times`, (t) => {
    updatesObj = {updates: {val: 5}}
    expect(firebaseRefUpdateSpy.callCount).to.equal(0)
    propertyFirebaseSaver.save(updatesObj)
    expect(firebaseRefUpdateSpy.callCount).to.equal(1)
    expect(firebaseRefChildSpy.callCount).to.equal(0)
    t.pass()
})

test(`IDatabaseSaver > PropertyFirebaseSaver::::save updates with no updates and 3 pushes should call the propertyFirebaseSaver's
     update method 0 times, and child().push() method 3 times`, (t) => {
    expect(firebaseRefChildSpy.callCount).to.equal(0)
    updatesObj = {
        pushes: {
            someArrayProperty: 9
        }
    }
    propertyFirebaseSaver.save(updatesObj)
    expect(firebaseRefChildSpy.callCount).to.equal(1)
    updatesObj = {
        pushes: {
            someArrayProperty: 8
        }
    }
    propertyFirebaseSaver.save(updatesObj)
    expect(firebaseRefChildSpy.callCount).to.equal(2)
    updatesObj = {
        pushes: {
            someArrayProperty: 5
        }
    }
    propertyFirebaseSaver.save(updatesObj)
    expect(firebaseRefChildSpy.callCount).to.equal(3)
    expect(firebaseRefUpdateSpy.callCount).to.equal(0)
    t.pass()
})
