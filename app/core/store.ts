import {Store} from 'vuex'
import * as Vuex from 'vuex'
import {GRAPH_CONTAINER_ID, ROOT_ID} from './globals';
import {log} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
import {
    ContentUserPropertyNames, FieldMutationTypes, ITypeIdProppedDatedMutation, IIdProppedDatedMutation,
    ISigmaEventListener, ITooltipOpener, ITooltipRenderer, IVuexStore,
    ObjectTypes, TreePropertyNames, ICreateMutation, STORE_MUTATION_TYPES, IContentUserData, CONTENT_TYPES,
    IContentDataEither, IContentData, INewChildTreeMutationArgs, ITreeLocationData, id, ITree, ITreeData,
    ITreeDataWithoutId,
    ICreateTreeMutationArgs, ICreateTreeLocationMutationArgs, SetMutationTypes, IFamilyLoader, ICoordinate,
    IAddParentEdgeMutationArgs, ISigmaEdgeUpdater, ISigmaEdgeData, IAddNodeMutationArgs, IAddEdgeMutationArgs, IState,
    ISyncableMutableSubscribableUser,
    IUserData, IUserLoader, ISetUserDataMutationArgs, ISigmaGraph, IUserUtils, IObjectFirebaseAutoSaver,
    ISetMembershipExpirationDateArgs, IAddContentInteractionMutationArgs, ISetTreeDataMutationArgs,
    ISetTreeLocationDataMutationArgs, ISetTreeUserDataMutationArgs, ISetContentDataMutationArgs,
    ISetContentUserDataMutationArgs,
} from '../objects/interfaces';
import {SigmaEventListener} from '../objects/sigmaEventListener/sigmaEventListener';
import {TooltipOpener} from '../objects/tooltipOpener/tooltipOpener';
import {TYPES} from '../objects/types';
import {inject, injectable, tagged} from 'inversify';
import {TooltipRenderer} from '../objects/tooltipOpener/tooltipRenderer';
import {ContentUserData} from '../objects/contentUser/ContentUserData';
import {myContainer, state} from '../../inversify.config';
import {distance} from '../objects/treeLocation/determineNewLocationUtils';
import {determineNewLocation, obtainNewLocation} from '../objects/treeLocation/determineNewLocation';
import {createParentSigmaEdge} from '../objects/sigmaEdge/sigmaEdge';
import {MutableSubscribableUser} from '../objects/user/MutableSubscribableUser';
import {IMutableSubscribableUser} from '../objects/interfaces';
import {IProppedDatedMutation} from '../objects/interfaces';
import {UserPropertyNames, ITreeUserData} from '../objects/interfaces';
import {TAGS} from '../objects/tags';
import * as firebase from 'firebase';
import {UserDeserializer} from '../loaders/user/UserDeserializer';
import {UserLoader} from '../loaders/user/UserLoader';
import {ObjectFirebaseAutoSaver} from '../objects/dbSync/ObjectAutoFirebaseSaver';

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
    CREATE_USER_OR_LOGIN = 'create_user_or_login',
    LOGIN = 'login',
    INITIALIZE_SIGMA_INSTANCE = 'initializeSigmaInstance',
    JUMP_TO = 'jump_to',
    REFRESH = 'refresh',
    ADD_NODE = 'add_node',
    ADD_EDGES = 'add_edges',
    CREATE_CONTENT_USER_DATA = 'create_content_user_data',
    CREATE_CONTENT = 'create_content',
    CREATE_TREE_LOCATION = 'create_tree_location',
    CREATE_TREE = 'create_tree',
    ADD_CONTENT_INTERACTION = 'add_content_interaction',
    ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA = 'ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA',
    ADD_FIRST_CONTENT_INTERACTION = 'add_first_content_interaction',
    CHANGE_USER_ID = 'changeUserId',
    NEW_CHILD_TREE = 'new_child_tree',
    ADD_CHILD_TO_PARENT = ' add_child_to_parent',
    ADD_PARENT_EDGE_NO_REFRESH = 'add_parent_edge_no_refresh',
    SET_USER_DATA = 'set_user_data',
    SET_MEMBERSHIP_EXPIRATION_DATE = 'set_membership_expiration_date',
    LOGIN_WITH_FACEBOOK = 'login_with_facebook',
    SET_TREE_DATA = 'set_tree_data',
    SET_TREE_LOCATION_DATA = 'set_tree_location_data',
    SET_TREE_USER_DATA = 'set_tree_user_data',
    SET_CONTENT_DATA = 'set_content_data',
    SET_CONTENT_USER_DATA = 'set_content_user_data',
}

const getters = {
    getStore(): Store<any> {
        return {} as Store<any>
    }, // Getter Will get redefined later during store constructor
    sigmaGraph(state: IState, getters): ISigmaGraph {
        log ('getters sigmaGraph called')
        if (!state.sigmaInitialized) {
            throw new Error ('Cant access sigmaGraph yet. Sigma not yet initialized')
        }
        return state.sigmaInstance.graph
    },
    sampleGetter() {
        return num => num * 5
    },
    sampleAsyncGetter() {
        return num => {
            return new Promise( (resolve, reject) => {
                setTimeout(() => {
                    resolve(num * 5)
                }, 1000)
            })
        }
    },
    userId(state: IState, getters): id {
        console.log('userId getter called')
        return state.userId
    },
    userData(state: IState, getters) {
        console.log('userData getter called')
        return (userId: id) => {
            console.log('userData getter inside called')
            var reactive = state.usersDataHashmapUpdated
            var obj = {
                reactive: state.usersDataHashmapUpdated,
                ...state.usersData[userId]
            }
            return obj
        }
    },
    loggedIn(state: IState, getters): boolean {
        const loggedIn = !!state.userId
        return loggedIn
    },
    async hasAccess(state: IState, getters): Promise<boolean> {
        return false
        // return await getters.userHasAccess(state.userId)
    },
    userHasAccess(state: IState, getters) {
        return (userId: id): boolean => {
            const userData: IUserData = getters.userData(userId)
            if (!userData) {
                return false
            } else {
                return userData.membershipExpirationDate >= Date.now()
            }
            // if (!userId) {
            //     return false
            // }
            // const user: ISyncableMutableSubscribableUser = state.users[userId]
            //     || await state.userLoader.downloadUser(userId)
            // const expirationTime = user.membershipExpirationDate.val()
            // return expirationTime >= Date.now()
        }
    },
    treeData(state: IState, getters) {
        return (treeId: id): ITreeDataWithoutId => state.globalDataStoreData.trees[treeId]
    },
    treeLocationData(state: IState, getters) {
        return (treeId: id): ITreeLocationData => state.globalDataStoreData.treeLocations[treeId]
    },
    treeUsersData(state: IState, getters) {
        return (treeUserId: id): ITreeUserData => state.globalDataStoreData.treeUsers[treeUserId]
    },
    contentData(state: IState, getters) {
        return (contentId: id): IContentData => state.globalDataStoreData.content[contentId]
    },
    contentUserData(state: IState, getters) {
        return (contentUserId: id): IContentUserData => state.globalDataStoreData.contentUsers[contentUserId]
    },
}
const mutations = {
    initializeSigmaInstance() {

    },
    [MUTATION_NAMES.JUMP_TO](state: IState, treeId) {
        // state.jumpToId = treeId
    },
    [MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE](state: IState) {
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
         inside of store.ts and rather did it inside of appContainer or inversify.config.ts */
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
    [MUTATION_NAMES.REFRESH](state: IState) {
        state.sigmaInstance.refresh()
    },
    [MUTATION_NAMES.CHANGE_USER_ID](state: IState, userId) {
        state.userId = userId
    },
// TODO: if contentUser does not yet exist in the DB create it.
    [MUTATION_NAMES.ADD_CONTENT_INTERACTION](
        state: IState, {contentUserId, proficiency, timestamp}: IAddContentInteractionMutationArgs
    ) {
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
    [MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA](
        state: IState, {contentUserId, proficiency, timestamp}) {
        const contentUserData: IContentUserData = {
            id: contentUserId,
            timer: 0, // TODO: add sampleContentUser1Timer to app
            lastEstimatedStrength: null, // TODO: Add initial calculate strength to app,
            overdue: false, // TODO: add initial sampleContentUser1Overdue functionality
            lastInteractionTime: null,
            nextReviewTime: null, // TODO: add initial calculate sampleContentUser1NextReviewTime functionality
            proficiency,
        }
        /**
         * logic for initial stuff up there ^^^^
         *
         if (this.sampleContentUser1Proficiency > PROFICIENCIES.ONE && !this.hasInteractions()){
                    millisecondsSinceLastInteraction = 60 * 60 * 1000
                }
         *
         */
        mutations[MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state, {contentUserId, contentUserData})
        mutations[MUTATION_NAMES.ADD_CONTENT_INTERACTION](state, {contentUserId, proficiency, timestamp})
        return contentUserData
    },
    [MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state: IState, {contentUserId, contentUserData}) {
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
        state: IState,
        {
            parentTreeId, timestamp, contentType, question, answer, title, parentLocation,
        }: INewChildTreeMutationArgs
    ): id {
        log('NEW CHILD TREE CALLED. parentX and parentY are ', parentLocation.point.x, parentLocation.point.y)
        // TODO: UNIT / INT TEST
        const store = getters.getStore()
        /**
         * Create Content
         */
        const contentId = store.commit(MUTATION_NAMES.CREATE_CONTENT, {
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
            obtainNewLocation(
                {r, sigmaInstance: state.sigmaInstance, parentCoordinate: {x: parentLocation.point.x, y: parentLocation.point.y}})

        const createTreeLocationMutationArgs: ICreateTreeLocationMutationArgs = {
            treeId: treeIdString, x: newLocation.x, y: newLocation.y, level: parentLocation.level + 1
        }

        const treeLocationData = store.commit(MUTATION_NAMES.CREATE_TREE_LOCATION, createTreeLocationMutationArgs)
        /* TODO: Why can't I type treelocationData? why are all the mutation methods being listed as void? */
        /**
         * Add the newly created tree as a child of the parent
         */
        store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId: treeId})

        return treeIdString
        },
    [MUTATION_NAMES.ADD_CHILD_TO_PARENT](state: IState,
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
    [MUTATION_NAMES.CREATE_CONTENT](state: IState, {
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
    [MUTATION_NAMES.CREATE_TREE](state: IState, {parentId, contentId, children = []}: ICreateTreeMutationArgs): id {
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
        state: IState,
        {
            treeId, x, y, level
        }: ICreateTreeLocationMutationArgs
    ): ITreeLocationData {
        const createMutation: ICreateMutation<ITreeLocationData> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: ObjectTypes.TREE_LOCATION,
            data: {
                point: {
                    x, y,
                },
                level,
            },
            id: treeId
        }
        const treeLocationData = state.globalDataStore.addMutation(createMutation)
        return treeLocationData
    },
    // [MUTATION_NAMES.ADD_PARENT_EDGE_NO_REFRESH](state, {parentId, treeId, color}: IAddParentEdgeMutationArgs) {
    //     const edge: ISigmaEdgeData = createParentSigmaEdge({parentId, treeId, color})
    //     if (state.sigmaInitialized) {
    //         state.graph.addEdge(edge)
    //     } else {
    //         state.graphData.edges.push(edge)
    //     }
    //
    // },
    [MUTATION_NAMES.ADD_NODE](state: IState, {node}: IAddNodeMutationArgs) {
        // const addParentEdgeMutationArgs: IAddParentEdgeMutationArgs = {
        //     parentId: node.parentId,
        //     treeId: node.id,
        //     // color: nod
        // }
        if (state.sigmaInitialized) {
            state.graph.addNode(node)
            mutations[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
        } else {
            state.graphData.nodes.push(node)
        }
    },
    [MUTATION_NAMES.ADD_EDGES](state: IState, {edges}: IAddEdgeMutationArgs) {
        // const addParentEdgeMutationArgs: IAddParentEdgeMutationArgs = {
        //     parentId: node.parentId,
        //     treeId: node.id,
        //     // color: nod
        // }
        // log('inside of mutation add edges graph is',
        //     state.graph, state.sigmaInstance.graph, state.graph.addEdge,
        //     state.graph.addNode, state.sigmaInstance.graph.addEdge,
        //     state.sigmaInstance.graph.addNode)
        if (state.sigmaInitialized) {
            for (const edge of edges){
                state.graph.addEdge(edge)
            }
            mutations[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
        } else {
            state.graphData.edges.push(...edges)
        }
    },
    async [MUTATION_NAMES.LOGIN](state: IState, {userId}) {
    },
    async [MUTATION_NAMES.CREATE_USER_OR_LOGIN](state: IState, {userId}) {
        if (!userId) {
            throw new RangeError('UserId cannot be blank')
        }
        if (state.userId) {
            throw new Error('Can\'t log user with id of ' + userId
                + ' in!. There is already a user logged in with id of ' + state.userId)
        }
        const userExistsInDB = await state.userUtils.userExistsInDB(userId)
        console.log('store.ts userExistsInDB is', userExistsInDB)
        let user: ISyncableMutableSubscribableUser
        if (!userExistsInDB) {
            user = await state.userUtils.createUserInDB(userId)
        } else {
            user = await state.userLoader.downloadUser(userId)
        }
        storeUserInState({user, userId, state})
        // TODO: once we have firebase priveleges, we may not be able to check if the user exists or not

    },
    [MUTATION_NAMES.SET_USER_DATA](state: IState, {userId, userData}: ISetUserDataMutationArgs) {
        Vue.set(state.usersData, userId, userData)
        // state.usersData[userId] = userData
        console.log('set_user_data mutation called', state.usersData, state.usersData[userId], userData)
        Vue.set(state, 'usersDataHashmapUpdated', Math.random())
    },
    [MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE](
        state: IState, {membershipExpirationDate, userId}: ISetMembershipExpirationDateArgs) {
        const user: IMutableSubscribableUser = state.users[userId]
        const membershipDateMutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> = {
            propertyName: UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: membershipExpirationDate
        }
        const activatedMutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> = {
            propertyName: UserPropertyNames.EVER_ACTIVATED_MEMBERSHIP,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: true
        }
        user.addMutation(membershipDateMutation)
        user.addMutation(activatedMutation)
        console.log('activatedMutation and membershipDateMutation just added')
        const userData: IUserData = user.val()
        const store: Store<any> = getters.getStore()
        const mutationArgs: ISetUserDataMutationArgs = {
            userId,
            userData
        }
        // TODO: just have an onUpdate to user trigger store mutation rather than directly calling this mutation
        store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs)
        // this will trigger the
    },
    [MUTATION_NAMES.LOGIN_WITH_FACEBOOK](state: IState) {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
        //     redirect_uri: window.location.protocol + '//' + window.location.hostname
            display: 'touch'
        })
        const store: Store<any> = getters.getStore()
        firebase.auth().signInWithRedirect(provider).then( (result) => {
            const userId = result.user.uid
            store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, {userId})
            log('login result', result)
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            const email = error.email
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential
            console.error('There was an error ', errorCode, errorMessage, email, credential)
        });
        firebase.auth().getRedirectResult().then(result => {
            console.log('firebase result received!!!', result)

        })

    },
    [MUTATION_NAMES.SET_TREE_DATA](state: IState, {treeId, treeDataWithoutId}: ISetTreeDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.trees, treeId, treeDataWithoutId)
    },
    [MUTATION_NAMES.SET_TREE_LOCATION_DATA](state: IState, {treeId, treeLocationData}: ISetTreeLocationDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.treeLocations, treeId, treeLocationData)
    },
    [MUTATION_NAMES.SET_TREE_USER_DATA](state: IState, {treeId, treeUserData}: ISetTreeUserDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.treeUsers, treeId, treeUserData)
    },
    [MUTATION_NAMES.SET_CONTENT_DATA](state: IState, {contentId, contentData}: ISetContentDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.content, contentId, contentData)
    },
    [MUTATION_NAMES.SET_CONTENT_USER_DATA](state: IState, {contentUserId, contentUserData }: ISetContentUserDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.contentUsers, contentUserId, contentUserData)
    },
}
// TODO: DO I even use these mutation? << YES
// mutations[MUTATION_NAMES.ADD_NODE] = (state, {node}: IAddNodeMutationArgs) => {
//     // const addParentEdgeMutationArgs: IAddParentEdgeMutationArgs = {
//     //     parentId: node.parentId,
//     //     treeId: node.id,
//     //     // color: nod
//     // }
//     if (state.sigmaInitialized) {
//         state.graph.addNode(node)
//         mutations[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
//     } else {
//         state.graphData.nodes.push(node)
//     }
// }
const actions = {}

let initialized = false
@injectable()
export default class BranchesStore {
    constructor(@inject(TYPES.BranchesStoreArgs){
        globalDataStore,
        state,
        userLoader,
        userUtils,
    }: BranchesStoreArgs) {
        if (initialized) {
            return {} as Store<any>
            // DON"T let the store singleton be messed up
        }
        const stateArg: IState = {
            ...state,
            globalDataStore,
            userLoader,
            userUtils
        }
        const store = new Store({
            state: stateArg,
            mutations,
            actions,
            getters,
        } ) as Store<any>
        getters.getStore = () => store
        store['globalDataStore'] = globalDataStore // added just to pass injectionWorks test
        store['userLoader'] = userLoader // added just to pass injectionWorks test
        store['userUtils'] = userUtils // added just to pass injectionWorks test
        store['_id'] = Math.random()
        initialized = true
        return store
    }
}
@injectable()
export class BranchesStoreArgs {
    @inject(TYPES.IMutableSubscribableGlobalStore) public globalDataStore
    @inject(TYPES.IUserLoader)
    @tagged(TAGS.AUTO_SAVER, true) public userLoader: IUserLoader
    @inject(TYPES.BranchesStoreState) public state: IState
    @inject(TYPES.IUserUtils) public userUtils: IUserUtils
}

function storeUserInState({user, state, userId}: {user: ISyncableMutableSubscribableUser, state: IState, userId: id}) {
    user.startPublishing() // << idk if necessary
    state.users[userId] = user
    state.usersData[userId] = user.val()
    state.userId = userId

    // user.onUpdate((newUserData: IUserData) => {
    //     const store: Store<any> = getters.getStore()
    //     store.commit(MUTATION_NAMES.SET_USER_DATA, {userData: newUserData, userId})
    // })

}
