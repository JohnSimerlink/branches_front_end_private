import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as firebase from 'firebase';
import {MockFirebase} from 'firebase-mock'
import {Container, interfaces} from 'inversify';
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {INITIAL_TREE_ID_TO_DOWNLOAD} from '../../core/globals';
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store';
import {FIREBASE_PATHS} from '../../loaders/paths';
import Reference = firebase.database.Reference;
import {TreeLoaderArgs} from '../../loaders/tree/TreeLoader';
import {
    IContentLoader, IContentUserLoader, IVueComponentCreator, ITreeLoader,
    ITreeLocationLoader, IKnawledgeMapCreator, ITree, IOneToManyMap
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from './KnawledgeMapNew';
import {TreeLocationLoaderArgs} from '../../loaders/treeLocation/TreeLocationLoader';
import {ContentLoaderArgs} from '../../loaders/content/ContentLoader';
import {ContentUserLoaderArgs} from '../../loaders/contentUser/ContentUserLoader';
import {TreeUserLoaderArgs} from '../../loaders/treeUser/TreeUserLoader';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {log} from '../../core/log'
import {SpecialTreeLoader} from '../../loaders/tree/specialTreeLoader';
let Vue = require('vue').default; // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
// import register from 'ignore-styles'
// process.env.node_ENV = 'test' && register(['.html'])
myContainerLoadAllModules();
test('knawledeMap DI constructor should work', t => {
    const injects = injectionWorks<KnawledgeMapCreatorArgs, KnawledgeMapCreator >({
        container: myContainer,
        argsType: TYPES.KnawledgeMapCreatorArgs,
        interfaceType: TYPES.IKnawledgeMapCreator,
    });
    expect(injects).to.equal(true);
    t.pass()
});
test.beforeEach((t) => {
    myContainer.snapshot();
    const mockTreesRef = new MockFirebase(FIREBASE_PATHS.TREES);
    const mockTreeLocationsRef = new MockFirebase(FIREBASE_PATHS.TREE_LOCATIONS);
    const mockContentRef = new MockFirebase(FIREBASE_PATHS.CONTENT);
    const mockContentUsersRef = new MockFirebase(FIREBASE_PATHS.CONTENT_USERS);
    const mockTreeUsersRef = new MockFirebase(FIREBASE_PATHS.TREE_USERS);
    myContainer.unbind(TYPES.FirebaseReference);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreesRef)
        .whenInjectedInto(TreeLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentRef)
        .whenInjectedInto(ContentLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockContentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs);
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(mockTreeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)
});
test.afterEach(t => {
    myContainer.snapshot()
});
test('KnawledgeMap::::create knawledgeMap should work', (t) => {
    const treeLoader: ITreeLoader = {
        downloadData() {}
    }  as any as ITreeLoader;
    const contentIdSigmaIdsMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap);
    const specialTreeLoader: ITreeLoader = new SpecialTreeLoader({treeLoader, contentIdSigmaIdsMap});
    const treeLoaderDownloadDataSpy = sinon.spy(treeLoader, 'downloadData');
    const treeLocationLoader: ITreeLocationLoader = myContainer.get<ITreeLocationLoader>(TYPES.ITreeLocationLoader);
    const treeLocationLoaderDownloadDataSpy = sinon.spy(treeLocationLoader, 'downloadData');
    const contentLoader: IContentLoader = myContainer.get<IContentLoader>(TYPES.IContentLoader);
    const contentLoaderDownloadDataSpy = sinon.spy(contentLoader, 'downloadData');
    const contentUserLoader: IContentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader);
    const contentUserLoaderDownloadDataSpy = sinon.spy(contentUserLoader, 'downloadData');
    const userId = '4324324abc';
    const store = {
        commit() {}
    };
    const storeCommitSpy = sinon.spy(store, 'commit');
    const knawledgeMapCreator: IKnawledgeMapCreator
        = myContainer.get<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator);
    const knawledgeMap = knawledgeMapCreator.create();

    expect(treeLoaderDownloadDataSpy.callCount).to.equal(0);
    knawledgeMap.mounted();
    expect(treeLoaderDownloadDataSpy.callCount).to.equal(2);
    let calledWith = treeLoaderDownloadDataSpy.getCall(0).args[0];
    const expectedCalledWith = INITIAL_TREE_ID_TO_DOWNLOAD;
    expect(calledWith).to.equal(expectedCalledWith);

    expect(storeCommitSpy.callCount).to.equal(1);
    calledWith = storeCommitSpy.getCall(0).args[0];
    expect(calledWith).to.equal(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);

    t.pass()
});
test('KnawledgeMap::::trying to create and mount component VueJS style', (t) => {
    const contentId = 'abc123';
    const userId = 'bdd123';
    // const treeLoader: ITreeLoader = myContainer.get<ITreeLoader>(TYPES.ITreeLoader)

    const treeLoader: ITreeLoader = {
        downloadData() {}
    }  as any as ITreeLoader;
    const contentIdSigmaIdsMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap);
    const specialTreeLoader: ITreeLoader = new SpecialTreeLoader({treeLoader, contentIdSigmaIdsMap});

    const treeLocationLoader: ITreeLocationLoader = myContainer.get<ITreeLocationLoader>(TYPES.ITreeLocationLoader);
    const contentLoader: IContentLoader = myContainer.get<IContentLoader>(TYPES.IContentLoader);
    const contentUserLoader: IContentUserLoader = myContainer.get<IContentUserLoader>(TYPES.IContentUserLoader);
    const store: BranchesStore = myContainer.get<BranchesStore>(TYPES.BranchesStore);
    const knawledgeMapCreator: IKnawledgeMapCreator
        = myContainer.get<IKnawledgeMapCreator>(TYPES.IKnawledgeMapCreator);
    //     = new KnawledgeMapCreator({
    //     specialTreeLoader,
    //     treeLocationLoader,
    //     contentLoader,
    //     contentUserLoader,
    //     store,
    //     userId
    // })
    const KnawledgeMapComponent = knawledgeMapCreator.create();
    const Constructor = Vue.extend(KnawledgeMapComponent);
    const propsData = {
        // contentId,
        // userId,
    };
    // const instance = new Constructor({propsData}).$mount()
    const instance = new Constructor();
    instance.$mount();
    instance.aMethod();
    log('instance in knawldegMapSPEC is', instance);
    // instance.methods.proficiencyClicked()

    t.pass()
});
