import {Store} from 'vuex'
import * as Vuex from 'vuex'
import {GRAPH_CONTAINER_ID, ROOT_ID} from './globals';
import {log} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
import {
    ContentUserPropertyNames, FieldMutationTypes, ITypeIdProppedDatedMutation, IIdProppedDatedMutation,
    ISigmaEventListener, ITooltipOpener, ITooltipRenderer, IVuexStore,
    ObjectTypes, TreePropertyNames, ICreateMutation, STORE_MUTATION_TYPES, IContentUserData, CONTENT_TYPES,
    IContentDataEither, IContentData, INewChildTreeArgs, ITreeLocationData, id, ITree, ITreeData, ITreeDataWithoutId,
    ICreateTreeMutationArgs, ICreateTreeLocationMutationArgs, SetMutationTypes, IFamilyLoader, ICoordinate
} from '../objects/interfaces';
import {SigmaEventListener} from '../objects/sigmaEventListener/sigmaEventListener';
import {TooltipOpener} from '../objects/tooltipOpener/tooltipOpener';
import {TYPES} from '../objects/types';
import {inject, injectable} from 'inversify';
import {TooltipRenderer} from '../objects/tooltipOpener/tooltipRenderer';
import {ContentUserData} from '../objects/contentUser/ContentUserData';
import {myContainer, state} from '../../inversify.config';
import {distance} from '../objects/treeLocation/determineNewLocationUtils';
import {determineNewLocation, obtainNewLocation} from '../objects/treeLocation/determineNewLocation';

let Vue = require('vue').default // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
// import Vue from 'vue';
// if (!Vue) {
//     import * as Vue from 'vue'
// }
const sigmaAny: any = sigma
Vue.use(Vuex)

export enum MUTATION_NAMES {
    INITIALIZE_SIGMA_INSTANCE = 'initializeSigmaInstance',
    JUMP_TO = 'jump_to',
    REFRESH = 'refresh',
    ADD_NODE = 'add_node',
    CREATE_CONTENT_USER_DATA = 'create_content_user_data',
    CREATE_CONTENT = 'create_content',
    CREATE_TREE_LOCATION = 'create_tree_location',
    CREATE_TREE = 'create_tree',
    ADD_CONTENT_INTERACTION = 'add_content_interaction',
    ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA = 'ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA',
    ADD_FIRST_CONTENT_INTERACTION = 'add_first_content_interaction',
    CHANGE_USER_ID = 'changeUserId',
    NEW_CHILD_TREE = 'new_child_tree',
    ADD_CHILD_TO_PARENT = ' add_child_to_parent'
}

const getters = {
    getStore() {} // Will redefine later
}
const mutations = {
    initializeSigmaInstance() {

    },
    [MUTATION_NAMES.JUMP_TO](state, treeId) {
        state.jumpToId = treeId
    },
    [MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE](state) {
        const sigmaInstance /*: Sigma*/ = new sigma({
            graph: state.graphData,
            container: GRAPH_CONTAINER_ID,
            glyphScale: 0.7,
            glyphFillColor: '#666',
            glyphTextColor: 'white',
            glyphStrokeColor: 'transparent',
            glyphFont: 'FontAwesome',
            glyphFontStyle: 'normal',
            glyphTextThreshold: 6,
            glyphThreshold: 3,
        } as any/* as SigmaConfigs*/) as any
        // log('sigma truly just initialized')
        state.sigmaInstance = sigmaInstance
        state.graph = sigmaInstance.graph
        state.sigmaInitialized = true
        if (typeof window !== 'undefined') { // for debuggin only. NOT to be used by other classes
            const windowAny: any = window
            windowAny.sigmaInstance = sigmaInstance
        }

        sigmaInstance.cameras[0].goTo({x: 5, y: 5, ratio: .05})

        /* TODO: it would be nice if I didn't have to do all this constructing
         inside of store2.ts and rather did it inside of appContainer or inversify.config.ts */
        const store = getters.getStore()
        const tooltipRenderer: ITooltipRenderer = new TooltipRenderer({store})
        const tooltipsConfig = tooltipRenderer.getTooltipsConfig()
        const tooltips = sigmaAny.plugins.tooltips(sigmaInstance, sigmaInstance.renderers[0], tooltipsConfig)
        const tooltipOpener: ITooltipOpener =
            new TooltipOpener(
                {
                    tooltips,
                    store,
                    tooltipsConfig,
                })
        const familyLoader: IFamilyLoader = myContainer.get<IFamilyLoader>(TYPES.IFamilyLoader)
        const sigmaEventListener: ISigmaEventListener
            = new SigmaEventListener({tooltipOpener, sigmaInstance, familyLoader})
        sigmaEventListener.startListening()
    },
    [MUTATION_NAMES.REFRESH](state) {
        state.sigmaInstance.refresh()
    },
    [MUTATION_NAMES.CHANGE_USER_ID](state, userId) {
        state.userId = userId
    },
// TODO: if contentUser does not yet exist in the DB create it.
    [MUTATION_NAMES.ADD_CONTENT_INTERACTION](state, {contentUserId, proficiency, timestamp}) {
        const id = contentUserId
        const objectType = ObjectTypes.CONTENT_USER
        const propertyName = ContentUserPropertyNames.PROFICIENCY;
        const type = FieldMutationTypes.SET;
        const data = proficiency

        const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
            data, id, propertyName, timestamp, type
        }

        const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
            objectType,
            ...storeMutation
        }
        state.globalDataStore.addMutation(globalMutation)
        mutations[MUTATION_NAMES.REFRESH](state, null)
    },
    [MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA](state, {contentUserId, proficiency, timestamp}) {
        const contentUserData: IContentUserData = {
            id: contentUserId,
            timer: 0, // TODO: add timer to app
            lastRecordedStrength: null, // TODO: Add calculate strength to app,
            overdue: false, // TODO: add overdue functionality
            proficiency,
        }
        mutations[MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state, {contentUserId, contentUserData})
        mutations[MUTATION_NAMES.ADD_CONTENT_INTERACTION](state, {contentUserId, proficiency, timestamp})
        return contentUserData
    },
    [MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state, {contentUserId, contentUserData}) {
        const createMutation: ICreateMutation<ContentUserData> = {
            id: contentUserId,
            data: contentUserData,
            objectType: ObjectTypes.CONTENT_USER,
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
        }
        state.globalDataStore.addMutation(createMutation)
        // const contentUserData: IContentUserData = state.globalDataStore.addMutation(createMutation)
    //
    },
    [MUTATION_NAMES.NEW_CHILD_TREE](
        state,
        {
            parentTreeId, timestamp, contentType, question, answer, title, parentX, parentY,
        }: INewChildTreeArgs
    ): id {
        log("NEW CHILD TREE CALLED. parentX and parentY are ", parentX, parentY)
        // TODO: UNIT / INT TEST
        /**
         * Create Content
         */
        const contentId = mutations[MUTATION_NAMES.CREATE_CONTENT](state, {
            question, answer, title, type: contentType
        })
        const contentIdString = contentId as any as id // TODO: Why do I have to do this casting?

        /**
         * Create Tree
         */
        const createTreeMutationArgs: ICreateTreeMutationArgs = {
            parentId: parentTreeId, contentId: contentIdString
        }
        const treeId = mutations[MUTATION_NAMES.CREATE_TREE](state, createTreeMutationArgs)
        const treeIdString = treeId as any as id

        /**
         * Create TreeLocation
         */
        const r = 30
        const newLocation: ICoordinate =
            obtainNewLocation({r, sigmaInstance: state.sigmaInstance, parentCoordinate: {x: parentX, y: parentY}})

        const createTreeLocationMutationArgs: ICreateTreeLocationMutationArgs = {
            treeId: treeIdString, x: newLocation.x, y: newLocation.y
        }

        const treeLocationData = mutations[MUTATION_NAMES.CREATE_TREE_LOCATION](state, createTreeLocationMutationArgs)
        /* TODO: Why can't I type treelocationData? why are all the mutation methods being listed as void? */
        /**
         * Add the newly created tree as a child of the parent
         */
        mutations[MUTATION_NAMES.ADD_CHILD_TO_PARENT](state, {parentTreeId, childTreeId: treeId})

        return treeIdString
        },
    [MUTATION_NAMES.ADD_CHILD_TO_PARENT](state,
     {
         parentTreeId, childTreeId,
     }) {

        const globalStoreMutation: ITypeIdProppedDatedMutation<SetMutationTypes> = {
            objectType: ObjectTypes.TREE,
            id: parentTreeId,
            timestamp: Date.now(),
            type: SetMutationTypes.ADD,
            propertyName: TreePropertyNames.CHILDREN,
            data: childTreeId,
        }
        state.globalDataStore.addMutation(globalStoreMutation)

        // TODO: a second mutation that sets the parentId of the child? or is that handled in another mutation?
    },
    [MUTATION_NAMES.CREATE_CONTENT](state, {
        type, question, answer, title
    }: IContentDataEither): id {
        const createMutation: ICreateMutation<IContentData> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: ObjectTypes.CONTENT,
            data: {type, question, answer, title},
        }
        const contentId = state.globalDataStore.addMutation(createMutation)
        return contentId
    },
    [MUTATION_NAMES.CREATE_TREE](state, {parentId, contentId, children = []}: ICreateTreeMutationArgs): id {
        const createMutation: ICreateMutation<ITreeDataWithoutId> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: ObjectTypes.TREE,
            data: {parentId, contentId, children},
        }
        const treeId = state.globalDataStore.addMutation(createMutation)
        return treeId
    },
    // [MUTATION_NAMES.CREATE_TREE](
    //     state,
    //     {
    //         parentTreeId, contentId
    //     }: {parentTreeId: id, contentId: id}
    // ): id {
    //     const createMutation: ICreateMutation<ITreeDataWithoutId> = {
    //         type: STORE_MUTATION_TYPES.CREATE_ITEM,
    //         objectType: ObjectTypes.TREE,
    //         data: {parentId: parentTreeId, contentId, children: []},
    //     }
    //     const treeId = state.globalDataStore.addMutation(createMutation)
    //     log('treeId created in create tree mutation', treeId)
    //     return treeId
    // },
    [MUTATION_NAMES.CREATE_TREE_LOCATION](
        state,
        {
            treeId, x, y,
        }: ICreateTreeLocationMutationArgs
    ): ITreeLocationData {
        const createMutation: ICreateMutation<ITreeLocationData> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: ObjectTypes.TREE_LOCATION,
            data: {
                point: {
                    x, y,
                },
            },
            id: treeId
        }
        const treeLocationData = state.globalDataStore.addMutation(createMutation)
        return treeLocationData
    },
}
// TODO: DO I even use these mutation?
mutations[MUTATION_NAMES.ADD_NODE] = (state, node) => {
    if (state.sigmaInitialized) {
        state.graph.addNode(node)
        mutations[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
    } else {
        state.graphData.nodes.push(node)
    }
}
const actions = {}

let initialized = false
@injectable()
export default class BranchesStore {
    constructor(@inject(TYPES.BranchesStoreArgs){globalDataStore, state}) {
        if (initialized) {
            return {} as Store<any>
            // DON"T let the store singleton be messed up
        }
        const stateArg = {
            ...state,
            globalDataStore
        }
        const store = new Store({
            state: stateArg,
            mutations,
            actions,
            getters,
        } ) as Store<any>
        getters.getStore = () => store
        store['globalDataStore'] = globalDataStore // added just to pass injectionWorks test
        store['_id'] = Math.random()
        initialized = true
        return store
    }
}
@injectable()
export class BranchesStoreArgs {
    @inject(TYPES.IMutableSubscribableGlobalStore) public globalDataStore
    @inject(TYPES.BranchesStoreState) public state
}

