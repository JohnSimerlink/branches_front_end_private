import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
const windowAny: any = global
windowAny.requestAnimationFrame = (cb) => cb()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as sinon from 'sinon'
import {
    myContainer,
    mockTreesRef,
    // mockFirebaseReferences, myContainerLoadAllModulesExceptTreeStoreSourceSingletonAndFirebaseRefs,
    myContainerLoadAllModulesExceptFirebaseRefs, mockFirebaseReferences,
} from '../../inversify.config';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store2'
import {TYPES} from '../objects/types';
import {error} from './log'
import {log} from './log'
import {Store} from 'vuex';
import {AppContainer} from './appContainer';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import {
    IMutableSubscribableTreeStore,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableTree, ITreeDataWithoutId,
    ObjectDataTypes
} from '../objects/interfaces';
import {SubscribableTreeStoreSource, SubscribableTreeStoreSourceArgs} from '../objects/stores/SubscribableStoreSource';
import {TreeDeserializer} from '../loaders/tree/TreeDeserializer';
import {ContainerModule, interfaces} from 'inversify';
import {TAGS} from '../objects/tags';
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

test('App integration test 4 - BranchesStore mutation add new child treeId to parent' +
    ' children set should update the value in the appropriate firebase ref', async (t) => {

    // const subscribableTreeStoreSourceSingleton: ISubscribableTreeStoreSource
    //     = new SubscribableTreeStoreSource({hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.TREE_DATA})
    // log('The subscribableTreeStoreSourceSingleton created in app integration 4 id is ',
    //     subscribableTreeStoreSourceSingleton['_id'])
    // myContainer.load(
    //     new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    //     bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    //         .toConstantValue(subscribableTreeStoreSourceSingleton)
    //         .whenTargetTagged(TAGS.MAIN_APP, true)
    //     bind<SubscribableTreeStoreSourceArgs>(TYPES.SubscribableTreeStoreSourceArgs)
    //     .to(SubscribableTreeStoreSourceArgs)
    //     })
    // )
    myContainer.load(mockFirebaseReferences)

        // bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
        //     .toConstantValue(subscribableTreeStoreSourceSingleton)
        //     .whenTargetTagged(TAGS.MAIN_APP, true)
        // bind<SubscribableTreeStoreSourceArgs>(TYPES.SubscribableTreeStoreSourceArgs)
        // .to(SubscribableTreeStoreSourceArgs)
        // })
    myContainerLoadAllModulesExceptFirebaseRefs()
    // TODO: use fake firebaseRefs
    // myContainer.unbind<)
    /* TODO: make the test super easy to set up . . .
     e.g. I don't have to set up the subscriptions myself and can just call instance.method() */
    // myContainer.unload(firebaseReferences)
    log('This is start of app integration 4')
    // myContainer.unbind(TYPES.FirebaseReference)
    log('This is after start of app integration 4')

    const parentTreeId = '1934879abcd19823'
    const childTreeId = '12498732578'

    const newContentId = '4324234'
    const newParentId = '4344324234'
    const newChildren = ['45344324234', 'aabc321', 'abcd43132']
    const treeDataWithoutId: ITreeDataWithoutId = {
        children: newChildren,
        contentId: newContentId,
        parentId: newParentId,
    }
    const tree: ISyncableMutableSubscribableTree
        = TreeDeserializer.deserializeWithoutId({treeDataWithoutId, treeId: newParentId})

    // subscribableTreeStoreSourceSingleton.set(parentTreeId, tree)
    // myContainer.unload(treeStoreSourceSingletonModule)
    // myContainer.unbind(TYPES.ISubscribableTreeStoreSource)
    // // myContainer
    // myContainer.bind<ISubscribableTreeStoreSource>
    //     (TYPES.ISubscribableTreeStoreSource)
    //     .toConstantValue(subscribableTreeStoreSourceSingleton)
    //     .whenTargetTagged(TAGS.MAIN_APP, true)
    //
    // myContainer.load(
    //     new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    //     bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    //         .toConstantValue(subscribableTreeStoreSourceSingleton)
    //         .whenTargetTagged(TAGS.MAIN_APP, true)
    //     bind<SubscribableTreeStoreSourceArgs>(TYPES.SubscribableTreeStoreSourceArgs)
    //     .to(SubscribableTreeStoreSourceArgs)
    //     })
    // )

    // subscribableTreeStoreSourceSingleton

    // myContainer.unbind()

    const parentTreeRef = mockTreesRef.child(parentTreeId)
    const parentTreeChildrenPropertyRef = parentTreeRef.child('children')
    // const
    // log('GlobalDataStore just created')
    /**
     * Grab the store singleton
     * @type {Store<any>}
     */
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>

    // store.commit(MUTATION_NAMES.CREATE_TREE, {
    //
    // })

    const parentTreeChildrenPropertyRefUpdateSpy = sinon.spy(parentTreeChildrenPropertyRef, 'update')
    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    // const autoSaveMutableSubscribableTreEStore: IMutableSubscribableTreeStore = appContainer['']
    /**
     * initialize sigma to avoid refresh on null error
     */
    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
    /**
     * get data in the store source and with syncers
     */
    store.commit(MUTATION_NAMES.CREATE_TREE, treeDataWithoutId )
    /**
     * Do the actual commit we are testing
     */
    store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId})

    expect(parentTreeChildrenPropertyRefUpdateSpy.callCount).to.deep.equal(1)

    t.pass()
})
