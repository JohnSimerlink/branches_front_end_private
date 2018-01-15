import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock'
import {Container, interfaces} from 'inversify';
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {INITIAL_ID_TO_DOWNLOAD} from '../../core/globals';
import {MUTATION_NAMES} from '../../core/store2';
import {FIREBASE_PATHS} from '../../loaders/paths';
import Reference = firebase.database.Reference;
import {TreeLoaderArgs} from '../../loaders/tree/TreeLoader';
import {
    IContentLoader, IContentUserLoader, VueComponentCreator, ITreeLoader,
    ITreeLocationLoader
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {KnawledgeMapCreator} from './knawledgeMap2';
import {TreeLocationLoaderArgs} from '../../loaders/treeLocation/TreeLocationLoader';
import {ContentLoaderArgs} from '../../loaders/content/ContentLoader';
import {ContentUserLoaderArgs} from '../../loaders/contentUser/ContentUserLoader';
import {TreeUserLoaderArgs} from '../../loaders/treeUser/TreeUserLoader';
// import register from 'ignore-styles'
// process.env.node_ENV = 'test' && register(['.html'])

test.beforeEach((t) => {
    myContainer.snapshot()
    const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES)
    const mockTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS)
    const mockContentRef = new MockFirebase(FIREBASE_PATHS.CONTENT)
    const mockContentUsersRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS)
    const mockTreeUsersRef = new MockFirebase(FIREBASE_PATHS.TREE_USERS)
    myContainer.unbind(TYPES.FirebaseReference)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenInjectedInto(ContentLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)
})
test.afterEach(t => {
    myContainer.snapshot()
})
test('KnawledgeMap::::create knawledgeMap should work', (t) => {
    const treeLoader: ITreeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
    const treeLoaderDownloadDataSpy = sinon.spy(treeLoader, 'downloadData')
    const treeLocationLoader: ITreeLocationLoader = myContainer.get<ITreeLocationLoader>(TYPES.ITreeLocationLoader)
    const treeLocationLoaderDownloadDataSpy = sinon.spy(treeLocationLoader, 'downloadData')
    const contentLoader: IContentLoader = myContainer.get<IContentLoader>(TYPES.IContentLoader)
    const contentLoaderDownloadDataSpy = sinon.spy(contentLoader, 'downloadData')
    const contentUserLoader: IContentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader)
    const contentUserLoaderDownloadDataSpy = sinon.spy(contentUserLoader, 'downloadData')
    const userId = '4324324abc'
    const store = {
        commit() {}
    }
    const storeCommitSpy = sinon.spy(store, 'commit')
    const knawledgeMapCreator: VueComponentCreator
        = new KnawledgeMapCreator({treeLoader, treeLocationLoader, contentLoader, contentUserLoader, userId, store})
    const knawledgeMap = knawledgeMapCreator.create()

    expect(treeLoaderDownloadDataSpy.callCount).to.equal(0)
    knawledgeMap.mounted()
    expect(treeLoaderDownloadDataSpy.callCount).to.equal(2)
    let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0]
    const expectedCalledWith = INITIAL_ID_TO_DOWNLOAD
    expect(calledWith).to.equal(expectedCalledWith)

    expect(storeCommitSpy.callCount).to.equal(1)
    calledWith = storeCommitSpy.getCall(0).args[0]
    expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)

    t.pass()
})
