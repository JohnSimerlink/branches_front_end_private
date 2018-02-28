import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
const windowAny: any = global
windowAny.requestAnimationFrame = (cb) => cb()
import test from 'ava'
import {expect} from 'chai'
import {MockFirebase} from 'firebase-mock'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {FIREBASE_PATHS} from '../loaders/paths';
import {TreeLoader} from '../loaders/tree/TreeLoader';
import {TreeLocationLoader} from '../loaders/treeLocation/TreeLocationLoader';
import {
    CONTENT_TYPES, IMutableSubscribableContentStore, IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    INewTreeComponentCreator, IOneToManyMap, ISigma, ISigmaUpdater, ISubscribableContentStoreSource, ITreeDataWithoutId,
    ITreeLocationData
} from '../objects/interfaces';
import {
    IRenderManager,
    IStoreSourceUpdateListener
} from '../objects/interfaces';
import {
    IHash,
    IRenderManagerCore,
    ISigmaNode, ISigmaNodesUpdater, IStoreSourceUpdateListenerCore,
} from '../objects/interfaces';
import {ISigmaRenderManager,
    ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource} from '../objects/interfaces';
import {RenderManager} from '../objects/sigmaNode/RenderManager';
import {RenderManagerCore} from '../objects/sigmaNode/RenderManagerCore';
import {SigmaNodesUpdater} from '../objects/sigmaNode/SigmaNodesUpdater';
import BranchesStore, {BranchesStoreArgs, MUTATION_NAMES} from './store'
import {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} from '../objects/stores/StoreSourceUpdateListener';
import {
    StoreSourceUpdateListenerCore,
    StoreSourceUpdateListenerCoreArgs
} from '../objects/stores/StoreSourceUpdateListenerCore';
import {TYPES} from '../objects/types';
import {TREE_ID} from '../testHelpers/testHelpers';
import {SigmaUpdater} from '../objects/sigmaUpdater/sigmaUpdater';
import {error} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
// import GraphData = SigmaJs.GraphData;
import {configureSigma} from '../objects/sigmaNode/configureSigma'
import {log} from './log'
import {OneToManyMap} from '../objects/oneToManyMap/oneToManyMap';
import * as Vue from 'vue';
import * as Vuex from 'vuex'
import {Store} from 'vuex';
import {partialInject} from '../testHelpers/partialInject';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from '../objects/stores/MutableSubscribableGlobalStore';
import {SubscribableTreeStore, SubscribableTreeStoreArgs} from '../objects/stores/tree/SubscribableTreeStore';
import {
    SubscribableContentStore,
    SubscribableContentStoreArgs
} from '../objects/stores/content/SubscribableContentStore';
import {NewTreeComponentCreator, NewTreeComponentCreatorArgs} from '../components/newTree/newTree';
import newTree from '../components/newTree/newTree';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableContentStore} from '../objects/stores/content/MutableSubscribableContentStore';
import {SubscribableTreeLocationStoreArgs} from '../objects/stores/treeLocation/SubscribableTreeLocationStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import Sigma = SigmaJs.Sigma;

myContainerLoadAllModules()
test('App integration test 3 - create new Tree triggered by user' +
    ' should create a new sigmaNode with the correct properties', async (t) => {
    // TODO: use fake firebaseRefs
    /* TODO: make the test super easy to set up . . .
     e.g. I don't have to set up the subscriptions myself and can just call instance.method() */
    Vue.use(Vuex)
    const parentTreeId = '1934879abcd19823'
    const parentX = 20
    const parentY = 20
    const type = CONTENT_TYPES.FACT
    const question = 'What is the capital of Ohio?'
    const answer = 'Columbus'

    const sigmaNodes: IHash<ISigmaNode> = {}
    const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
        = partialInject<StoreSourceUpdateListenerCoreArgs>({
        konstructor: StoreSourceUpdateListenerCore,
        constructorArgsType: TYPES.StoreSourceUpdateListenerCoreArgs,
        injections: {sigmaNodes},
        container: myContainer,
    })
    const storeSourceUpdateListener: IStoreSourceUpdateListener = partialInject<StoreSourceUpdateListenerArgs>({
        konstructor: StoreSourceUpdateListener,
        constructorArgsType: TYPES.StoreSourceUpdateListenerArgs,
        injections: {storeSourceUpdateListenerCore},
        container: myContainer,
    })
    const sigmaUpdater: ISigmaUpdater = myContainer.get<ISigmaUpdater>(TYPES.ISigmaUpdater)
    // new StoreSourceUpdateListenerCore({sigmaNodes, sigmaNodesUpdater, contentIdSigmaIdMap})
    const renderedNodesManagerCore: IRenderManagerCore
        = new RenderManagerCore({sigmaNodes, sigmaEdges: {}, sigmaUpdater})
    const renderedNodesManager: IRenderManager = new RenderManager({renderManagerCore: renderedNodesManagerCore})

    const treeStoreSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
    const treeLocationStoreSource: ISubscribableTreeLocationStoreSource
        = myContainer.get<ISubscribableTreeLocationStoreSource>
    (TYPES.ISubscribableTreeLocationStoreSource)
    const contentStoreSource: ISubscribableContentStoreSource
        = myContainer.get<ISubscribableContentStoreSource>
    (TYPES.ISubscribableContentStoreSource)
    // const treeStore

    const treeStore: IMutableSubscribableTreeStore
        = partialInject<SubscribableTreeStoreArgs>({
        konstructor: MutableSubscribableTreeStore,
        constructorArgsType: TYPES.SubscribableTreeStoreArgs,
        injections: {treeStoreSource},
        container: myContainer,
        // TYPES
    })
    const treeLocationStore: IMutableSubscribableTreeLocationStore
        = partialInject<SubscribableTreeLocationStoreArgs>({
        konstructor: MutableSubscribableTreeLocationStore,
        constructorArgsType: TYPES.SubscribableContentStoreArgs,
        injections: {treeLocationStoreSource},
        container: myContainer,
        // TYPES
    })
    const contentStore: IMutableSubscribableContentStore
        = partialInject<SubscribableContentStoreArgs>({
        konstructor: MutableSubscribableContentStore,
        constructorArgsType: TYPES.SubscribableContentStoreArgs,
        injections: {contentStoreSource},
        container: myContainer,
        // TYPES
    })
    // log('GlobalDataStore about to be created')
    const globalDataStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
        konstructor: MutableSubscribableGlobalStore,
        constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
        injections: {treeStore, contentStore, treeLocationStore},
        container: myContainer,
    })
    log('GlobalDataStore just created')
    const store: Store<any> =
        partialInject<BranchesStoreArgs>({
            konstructor: BranchesStore,
            constructorArgsType: TYPES.BranchesStoreArgs,
            injections: {globalDataStore},
            container: myContainer,
        })
    log('Branches Store in test id is', store['_id'])
    log('globalDataStore id is', globalDataStore['_globalStoreId'])
        log('store globalDataStore id is', store['globalDataStore']['_globalStoreId'])
        log('store globalDataStore substore ids are',
            '\ntreeStore -- ', store['globalDataStore']['treeStore']['_id'],
            '\ncontentStore -- ', store['globalDataStore']['contentStore']['_id'],
            '\ncontentUserStore -- ', store['globalDataStore']['contentUserStore']['_id'],
            '\ntreeUserStore -- ', store['globalDataStore']['treeUserStore']['_id'],
            '\ntreeLocationStore -- ', store['globalDataStore']['treeLocationStore']['_id'],
        )
    const newTreeComponentCreator =
        partialInject<NewTreeComponentCreatorArgs>({
            konstructor: NewTreeComponentCreator,
            constructorArgsType: TYPES.NewTreeComponentCreatorArgs,
            injections: {store},
            container: myContainer,
        })
    log('Branches Store in newTreeComponent Creator in integration test is ', newTreeComponentCreator['store']['_id'])
    const sigmaRenderManager: ISigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager)
    renderedNodesManager.subscribe(sigmaRenderManager)
    storeSourceUpdateListener.subscribe(treeStoreSource)
    storeSourceUpdateListener.subscribe(treeLocationStoreSource)
    globalDataStore.startPublishing()

    store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED)
    /* TODO: is it bad that my unit test has to test
    some property on the entire store . .. rather than just that property itself? */

    const NewTreeComponent = newTreeComponentCreator.create()
    const Constructor = Vue.extend(NewTreeComponent)
    const propsData = {
        parentId: parentTreeId,
        parentX,
        parentY,
    }
    const instance: any = new Constructor({propsData})
    /* TODO: Why do I have to do this cast on this integration test,
    but not on the tree spec test? */
    const numberOfNodes = numNodes({store})
    log('numberOfNodes is', numberOfNodes)
    expect(numberOfNodes).to.deep.equal(0)
    instance.$createElement()
    instance.$mount()
    instance.createNewTree(
        {
            type,
            question,
            answer,
        })
    expect(numNodes({store})).to.deep.equal(1)
    const nodeCorrect = thereIsOneNodeAndItContains(
        {
            store,
            type,
            question,
            answer
        })
    expect(nodeCorrect).to.equal(true)

    t.pass()
})

function numNodes({store}) {
    // TODO: LOL. Massive violation of Law of Demeter
    return store.state.sigmaInstance.graph.nodes().length
}
function thereIsOneNodeAndItContains({store, question, answer, type}): boolean {
    // TODO: LOL. Massive violation of Law of Demeter below
    const node: ISigmaNode = store.state.sigmaInstance.graph.nodes()[0]
    return node.content
        && node.content.question === question
        && node.content.answer === answer
        && node.content.type === CONTENT_TYPES.FACT
}
