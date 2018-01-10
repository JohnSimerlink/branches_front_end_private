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
import {IContentLoader, IKnawledgeMapCreator, ITreeLoader, ITreeLocationLoader} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {KnawledgeMapCreator} from './knawledgeMap2';
import {TreeLocationLoaderArgs} from '../../loaders/treeLocation/TreeLocationLoader';
// import register from 'ignore-styles'
// process.env.node_ENV = 'test' && register(['.html'])

test.beforeEach((t) => {
    myContainer.snapshot()
    const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
    myContainer.unbind(TYPES.FirebaseReference)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(firebaseRef)
        .whenInjectedInto(TreeLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(firebaseRef)
        .whenInjectedInto(TreeLocationLoaderArgs)
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
    const store = {
        commit() {}
    }
    const storeCommitSpy = sinon.spy(store, 'commit')
    const knawledgeMapCreator: IKnawledgeMapCreator
        = new KnawledgeMapCreator({treeLoader, treeLocationLoader, contentLoader, store})
    const knawledgeMap = knawledgeMapCreator.create()

    expect(treeLoaderDownloadDataSpy.callCount).to.equal(0)
    expect(treeLocationLoaderDownloadDataSpy.callCount).to.equal(0)
    expect(contentLoaderDownloadDataSpy.callCount).to.equal(1)
    knawledgeMap.mounted()
    expect(treeLoaderDownloadDataSpy.callCount).to.equal(2)
    expect(treeLocationLoaderDownloadDataSpy.callCount).to.equal(2)
    expect(contentLoaderDownloadDataSpy.callCount).to.equal(1)
    let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0]
    const expectedCalledWith = INITIAL_ID_TO_DOWNLOAD
    expect(calledWith).to.equal(expectedCalledWith)

    expect(storeCommitSpy.callCount).to.equal(2)
    calledWith = storeCommitSpy.getCall(0).args[0]
    expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)

    t.pass()
})
