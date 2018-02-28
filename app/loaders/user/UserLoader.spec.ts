import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    IUserLoader, ISyncableMutableSubscribableUser, IUserDataFromDB
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {FIREBASE_PATHS} from '../paths';
import {UserLoader, UserLoaderArgs} from './UserLoader';
import {expectedUser1, sampleUserData1, sampleUserDataFromDB1} from "../../objects/user/UserTestHelpers";

myContainerLoadAllModules()
test('UserLoader:::DI constructor should work', (t) => {
    const injects = injectionWorks<UserLoaderArgs, IUserLoader>({
        container: myContainer,
        argsType: TYPES.UserLoaderArgs,
        interfaceType: TYPES.IUserLoader,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('UserLoader:::DownloadUser should return the user', async (t) => {
    const userId = '12345' /* cannot have the same userId as others in the same file
     because the tests run in parallet and will trigger firebase events for other tests . . .if the ids are the same */
    const firebaseRef  = new MockFirebase(FIREBASE_PATHS.USERS)
    const childFirebaseRef = firebaseRef.child(userId)
    
    const sampleUserDataFromDB: IUserDataFromDB = sampleUserDataFromDB1

    const userLoader = new UserLoader({firebaseRef})

    // log('wrapped Promise is Fulfilled 1', wrappedPromise.isFulfilled())

    childFirebaseRef.fakeEvent('value', undefined, sampleUserDataFromDB)
    const userDataPromise: Promise<ISyncableMutableSubscribableUser> = userLoader.downloadUser(userId)
    // const wrappedPromise = makeQuerablePromise(userDataPromise)
    // log('wrapped Promise is Fulfilled 2', wrappedPromise.isFulfilled())
    childFirebaseRef.flush()
    // log('wrapped Promise is Fulfilled 3', wrappedPromise.isFulfilled())

    const user = await userDataPromise
    // log('wrapped Promise is Fulfilled 4', wrappedPromise.isFulfilled())

    expect(user.val()).to.deep.equal(sampleUserData1)
    t.pass()
})
