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
    /*  ISetMembershipExpirationDateArgs, IAddContentInteractionMutationArgs,*/ ISetTreeDataMutationArgs,
    ISetTreeLocationDataMutationArgs, ISetTreeUserDataMutationArgs, ISetContentDataMutationArgs,
    ISetContentUserDataMutationArgs, IMoveTreeCoordinateMutationArgs, PointMutationTypes, TreeLocationPropertyNames,
    ISetMembershipExpirationDateArgs, IAddContentInteractionMutationArgs, decibels, IAddUserPointsMutationArgs,
    UserPropertyMutationTypes, IEditFactMutationArgs, IEditCategoryMutationArgs, IEditMutation,
    ContentPropertyMutationTypes, ContentPropertyNames,
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
import {getUserId} from '../loaders/contentUser/ContentUserLoaderUtils';

let Vue = require('vue').default // for webpack
if (!Vue) {
    Vue = require('vue') // for ava-ts tests
}
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
    EDIT_FACT = 'edit_fact',
    EDIT_CATEGORY = 'edit_category',
    CREATE_TREE_LOCATION = 'create_tree_location',
    MOVE_TREE_COORDINATE = 'move_tree_coordinate',
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
    ADD_USER_POINTS = 'add_user_points',
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
        return state.userId
    },
    userData(state: IState, getters) {
        return (userId: id) => {
            var reactive = state.usersDataHashmapUpdated
            var obj = {
                reactive: state.usersDataHashmapUpdated,
                ...state.usersData[userId]
            }
            return obj
        }
    },
    userPoints(state: IState, getters) {
        return (userId: id) => {
            const userData = getters.userData(userId)
            if (!userData) {
                return 0
            }
            return userData.points
        }
    },
    contentUserLastEstimatedStrength(state: IState, getters) {
        return (contentUserId: id): decibels => {
            const contentUserData = state.globalDataStoreData.contentUsers[contentUserId]
            if (!contentUserData) {
                return 0
            }
            const lastEstimatedStrength: decibels = contentUserData.lastEstimatedStrength
            return lastEstimatedStrength
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
    [MUTATION_NAMES.ADD_USER_POINTS](state: IState, {userId, points}: IAddUserPointsMutationArgs) {
        const user = state.users[userId]

        const mutation: IProppedDatedMutation <UserPropertyMutationTypes,  UserPropertyNames> = {
            propertyName: UserPropertyNames.POINTS,
            timestamp: Date.now(),
            data: points,
            type: FieldMutationTypes.ADD
        }
        user.addMutation(mutation)
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
        const dragListener = sigmaAny.plugins.dragNodes(sigmaInstance, sigmaInstance.renderers[0])
        const familyLoader: IFamilyLoader = myContainer.get<IFamilyLoader>(TYPES.IFamilyLoader)
        const sigmaEventListener: ISigmaEventListener
            = new SigmaEventListener({tooltipOpener, sigmaInstance, familyLoader, dragListener, store})
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
        const lastEstimatedStrength = getters.contentUserLastEstimatedStrength(state, getters)(contentUserId)

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

        const newLastEstimatedStrength = getters.contentUserLastEstimatedStrength(state, getters)(contentUserId)
        const strengthDifference = newLastEstimatedStrength - lastEstimatedStrength

        const userId = getUserId({contentUserId})
        const addUserMutationPointArgs: IAddUserPointsMutationArgs = {
          userId, points: strengthDifference
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.ADD_USER_POINTS, addUserMutationPointArgs)

        store.commit(MUTATION_NAMES.REFRESH, null)
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
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.CREATE_CONTENT_USER_DATA, {contentUserId, contentUserData})
        store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {contentUserId, proficiency, timestamp})
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
        // TODO: UNIT / INT TEST
        const store = getters.getStore()
        /**
         * Create Content
         */
        const contentId /*: id */ = mutations[MUTATION_NAMES.CREATE_CONTENT](state, {
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
        type, question,
        answer, title
    }: IContentDataEither): id {
        const createMutation: ICreateMutation<IContentData> = {
            objectType: ObjectTypes.CONTENT,
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            data: {type, question, answer, title},
        }
        const contentId: id = state.globalDataStore.addMutation(createMutation)
        return contentId
    },
    [MUTATION_NAMES.EDIT_FACT](state: IState, {contentId, question, answer}: IEditFactMutationArgs) {
        const editQuestionMutation: IEditMutation<ContentPropertyMutationTypes> = {
            objectType: ObjectTypes.CONTENT,
            type: FieldMutationTypes.SET,
            id: contentId,
            propertyName: ContentPropertyNames.QUESTION,
            timestamp: Date.now(),
            data: question,
        }
        const editAnswerMutation: IEditMutation<ContentPropertyMutationTypes> = {
            objectType: ObjectTypes.CONTENT,
            type: FieldMutationTypes.SET,
            id: contentId,
            propertyName: ContentPropertyNames.ANSWER,
            timestamp: Date.now(),
            data: answer,
        }
        state.globalDataStore.addMutation(editQuestionMutation)
        state.globalDataStore.addMutation(editAnswerMutation)
    },
    [MUTATION_NAMES.EDIT_CATEGORY](state: IState, {contentId, title}: IEditCategoryMutationArgs) {

    },
    [MUTATION_NAMES.CREATE_TREE](state: IState, {parentId, contentId, children = []}: ICreateTreeMutationArgs): id {
        const createMutation: ICreateMutation<ITreeDataWithoutId> = {
            objectType: ObjectTypes.TREE,
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            data: {parentId, contentId, children},
        }
        const treeId = state.globalDataStore.addMutation(createMutation)
        return treeId
    },
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
    [MUTATION_NAMES.MOVE_TREE_COORDINATE](state: IState, {treeId, point }: IMoveTreeCoordinateMutationArgs) {
        const mutation: ITypeIdProppedDatedMutation<PointMutationTypes> = {
            objectType: ObjectTypes.TREE_LOCATION,
            id: treeId,
            timestamp: Date.now(),
            type: PointMutationTypes.SET,
            propertyName: TreeLocationPropertyNames.POINT,
            data: {point},
        }

        state.globalDataStore.addMutation(mutation)
    },
    [MUTATION_NAMES.ADD_NODE](state: IState, {node}: IAddNodeMutationArgs) {
        if (state.sigmaInitialized) {
            state.graph.addNode(node)
            mutations[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
        } else {
            state.graphData.nodes.push(node)
        }
    },
    [MUTATION_NAMES.ADD_EDGES](state: IState, {edges}: IAddEdgeMutationArgs) {
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
        let user: ISyncableMutableSubscribableUser
        if (!userExistsInDB) {
            user = await state.userUtils.createUserInDB(userId)
        } else {
            user = await state.userLoader.downloadUser(userId)
        }
        storeUserInStateAndSubscribe({user, userId, state})
        // TODO: once we have firebase priveleges, we may not be able to check if the user exists or not

    },
    [MUTATION_NAMES.SET_USER_DATA](state: IState, {userId, userData}: ISetUserDataMutationArgs) {
        Vue.set(state.usersData, userId, userData)
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

function storeUserInStateAndSubscribe({user, state, userId}: {user: ISyncableMutableSubscribableUser, state: IState, userId: id}) {

    const store = getters.getStore()
    user.onUpdate((userVal) => {
        const mutationArgs: ISetUserDataMutationArgs = {
            userData: userVal,
            userId,
        }
        store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs)
    })
    user.startPublishing()
    state.users[userId] = user
    state.usersData[userId] = user.val()
    state.userId = userId

}
