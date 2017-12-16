import {expect} from 'chai'
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock'
import {Container, interfaces} from 'inversify';
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {INITIAL_ID_TO_DOWNLOAD} from '../../core/globals';
import {MUTATION_NAMES} from '../../core/store2';
import {FIREBASE_PATHS} from '../../loaders/paths';
import Reference = firebase.database.Reference;
import {TreeLoaderArgs} from '../../loaders/tree/TreeLoader';
import {IKnawledgeMapCreator, ITreeLoader} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {KnawledgeMapCreator} from './knawledgeMap2';

describe('KnawledgeMap', () => {
    // let container: interfaces.Container
    beforeEach(() => {
        myContainer.snapshot()
        const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES)
        myContainer.bind<Reference>(TYPES.Reference).toConstantValue(firebaseRef)
            .whenInjectedInto(TreeLoaderArgs)

    })
    afterEach(() => {
        // myContainer.restore()
    })
    it('create knawledgeMap should work', () => {
        // const treeLoader: ITreeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
        // const treeLoaderDownloadDataSpy = sinon.spy(treeLoader, 'downloadData')
        // const store = {}
        // const storeCommitSpy = sinon.spy(store, 'commit')
        // const knawledgeMapCreator: IKnawledgeMapCreator = new KnawledgeMapCreator({treeLoader, store})
        // const knawledgeMap = knawledgeMapCreator.create()
        //
        // expect(treeLoaderDownloadDataSpy.callCount).to.equal(0)
        // knawledgeMap.created()
        // expect(treeLoaderDownloadDataSpy.callCount).to.equal(1)
        // let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0]
        // const expectedCalledWith = INITIAL_ID_TO_DOWNLOAD
        // expect(calledWith).to.equal(expectedCalledWith)
        //
        // expect(storeCommitSpy.callCount).to.equal(1)
        // calledWith = storeCommitSpy.getCall(0).args[0]
        // expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
    })

})
