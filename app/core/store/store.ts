import {Store} from 'vuex'
import * as Vuex from 'vuex'
import {
    GRAPH_CONTAINER_ID, GLOBAL_MAP_ROOT_TREE_ID, NON_EXISTENT_ID, MAP_DEFAULT_X, MAP_DEFAULT_Y,
    GLOBAL_MAP_ID
} from '../globals';
import {log} from '../log'
import Sigma from '../../../other_imports/sigma/sigma.core.js'
import {
    ContentUserPropertyNames, FieldMutationTypes, ITypeIdProppedDatedMutation, IIdProppedDatedMutation,
    ISigmaEventListener, ITooltipOpener, ITooltipRenderer, IVuexStore,
    GlobalStoreObjectTypes, TreePropertyNames, ICreateMutation, STORE_MUTATION_TYPES, IContentUserData, CONTENT_TYPES,
    IContentDataEither, IContentData, ITreeLocationData, id, ITree, ITreeData,
    ITreeDataWithoutId,
    ICreateTreeMutationArgs, ICreateTreeLocationMutationArgs, SetMutationTypes, IFamilyLoader, ICoordinate,
    IAddParentEdgeMutationArgs, ISigmaEdgeUpdater, ISigmaEdgeData, IAddNodeMutationArgs, IAddEdgeMutationArgs, IState,
    ISyncableMutableSubscribableUser,
    IUserData, IUserLoader, ISetUserDataMutationArgs, ISigmaGraph, IUserUtils, IObjectFirebaseAutoSaver,
    /*  ISetMembershipExpirationDateArgs, IAddContentInteractionMutationArgs,*/
    ISetMembershipExpirationDateArgs, IAddContentInteractionMutationArgs, decibels, IAddUserPointsMutationArgs,
    UserPropertyMutationTypes, ICreateMapMutationArgs, ICreateMapAndRootTreeIdMutationArgs,
    ISyncableMutableSubscribableBranchesMap, ICreateBranchesMapReturnObject, IBranchesMapData,
    ISetBranchesMapDataMutationArgs, ISetBranchesMapIdMutationArgs, ISetUserIdMutationArgs,
    ICreateUserPrimaryMapMutationArgs,
    ICreateContentMutationArgs,
    ICreatePrimaryUserMapIfNotCreatedMutationArgs, ILoadMapMutationArgs, ICreateUserOrLoginMutationArgs,
    ISaveUserInfoFromLoginProviderMutationArgs, ISigmaNodeLoader, ISigmaNodeLoaderCore, IBranchesMapLoader,
    ISwitchToMapMutationArgs, ILoadMapAndRootSigmaNodeMutationArgs, IBranchesMapUtils,
    IEditFactMutationArgs, IEditCategoryMutationArgs, IEditMutation,
    ContentPropertyMutationTypes, ContentPropertyNames, ISigmaFactory, timestamp, IHash,
} from '../../objects/interfaces';
import {SigmaEventListener} from '../../objects/sigmaEventListener/sigmaEventListener';
import {TooltipOpener} from '../../objects/tooltipOpener/tooltipOpener';
import {TYPES} from '../../objects/types';
import {inject, injectable, tagged} from 'inversify';
import {TooltipRenderer} from '../../objects/tooltipOpener/tooltipRenderer';
import {ContentUserData} from '../../objects/contentUser/ContentUserData';
import {myContainer, state} from '../../../inversify.config';
import {distance} from '../../objects/treeLocation/determineNewLocationUtils';
import {determineNewLocation, obtainNewCoordinate} from '../../objects/treeLocation/determineNewLocation';
import {createParentSigmaEdge} from '../../objects/sigmaEdge/sigmaEdge';
import {MutableSubscribableUser} from '../../objects/user/MutableSubscribableUser';
import {IMutableSubscribableUser, PointMutationTypes, TreeLocationPropertyNames} from '../../objects/interfaces';
import {IProppedDatedMutation} from '../../objects/interfaces';
import {UserPropertyNames, ITreeUserData} from '../../objects/interfaces';
import {TAGS} from '../../objects/tags';
import * as firebase from 'firebase';
import {UserDeserializer} from '../../loaders/user/UserDeserializer';
import {UserLoader} from '../../loaders/user/UserLoader';
import {ObjectFirebaseAutoSaver} from '../../objects/dbSync/ObjectAutoFirebaseSaver';
import {getUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {
    IPlayTreeMutationArgs,
    ISetContentMutationArgs, ISetContentUserMutationArgs, ISetTreeLocationMutationArgs, ISetTreeMutationArgs,
    ISetTreeUserMutationArgs,
    IJumpToMutationArgs, INewChildTreeMutationArgs, ISetTreeLocationDataMutationArgs, ISetTreeDataMutationArgs,
    ISetTreeUserDataMutationArgs, ISetContentDataMutationArgs, ISetContentUserDataMutationArgs,
} from './store_interfaces';
import {FlashcardTree} from '../../objects/flashcardTree/FlashcardTree'
import {FlashcardTreeFactory} from '../../objects/flashcardTree/FlashcardTreeFactory'
import Heap from 'heap'
import {MUTATION_NAMES} from './STORE_MUTATION_NAMES'
import {getters} from './store_getters'
import {IFlashcardTree} from '../../objects/flashcardTree/IFlashcardTree'
import {IFlashcardTreeData} from '../../objects/flashcardTree/IFlashcardTreeData'
import {INTERACTION_MODES} from './interactionModes';
import {IMoveTreeCoordinateMutationArgs} from './store_interfaces';

let Vue = require('vue').default || require('vue');
Vue.use(Vuex);

const mutations = {
    [MUTATION_NAMES.JUMP_TO](state: IState, {treeId}: IJumpToMutationArgs) {
        const camera = state.sigmaInstance.camera
        const {x, y} = state.globalDataStoreData.treeLocations[treeId].point
        camera.goTo({x, y})
    },
    [MUTATION_NAMES.ADD_USER_POINTS](state: IState, {userId, points}: IAddUserPointsMutationArgs) {
        const user = state.users[userId];

        const mutation: IProppedDatedMutation <UserPropertyMutationTypes,  UserPropertyNames> = {
            propertyName: UserPropertyNames.POINTS,
            timestamp: Date.now(),
            data: points,
            type: FieldMutationTypes.ADD
        };
        user.addMutation(mutation)
    },
    [MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED](state: IState) {
        if (state.sigmaInitialized) {
            return
        }
        const sigmaInstance /*: Sigma*/ =
            state.sigmaFactory.create({
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
        } as any/* as SigmaConfigs*/) as any;
        log('THE SIGMA INSTANCE JUST CREATED ', sigmaInstance);
        state.sigmaInstance = sigmaInstance;
        state.graph = sigmaInstance.graph;
        state.sigmaInitialized = true;
        if (typeof window !== 'undefined') { // for debuggin only. NOT to be used by other classes
            const windowAny: any = window;
            windowAny.sigmaInstance = sigmaInstance
        }

        sigmaInstance.cameras[0].goTo({x: 5, y: 5, ratio: .05});

        const renderer = sigmaInstance.renderers[0];
        state.renderer = renderer;
        /* TODO: it would be nice if I didn't have to do all this constructing
         inside of store.ts and rather did it inside of appContainer or inversify.config.ts */
        const store = getters.getStore();
        const tooltipRenderer: ITooltipRenderer = new TooltipRenderer({store});
        const tooltipsConfig = tooltipRenderer.getTooltipsConfig();
        const tooltips = state.sigmaFactory.plugins.tooltips(sigmaInstance, renderer, tooltipsConfig);
        const tooltipOpener: ITooltipOpener =
            new TooltipOpener(
                {
                    tooltips,
                    store,
                    tooltipsConfig,
                });
        const dragListener = state.sigmaFactory.plugins.dragNodes(sigmaInstance, renderer);
        const familyLoader: IFamilyLoader = myContainer.get<IFamilyLoader>(TYPES.IFamilyLoader);
        const sigmaEventListener: ISigmaEventListener
            = new SigmaEventListener({tooltipOpener, sigmaInstance, familyLoader, dragListener, store});
        sigmaEventListener.startListening()
    },
    [MUTATION_NAMES.REFRESH](state: IState) {
        if (!state.sigmaInitialized) {
            console.error('sigma is not initialized yet. we cannot call refresh');
            return
        }
        state.sigmaInstance.refresh()
    },
    [MUTATION_NAMES.SET_USER_ID](state: IState, {userId}: ISetUserIdMutationArgs) {
        log('mutations set user Id just called', userId);
        state.userId = userId;
        state.sigmaNodeLoaderCore.setUserId(userId)
    },
    // TODO: if contentUser does not yet exist in the DB create it.
    [MUTATION_NAMES.ADD_CONTENT_INTERACTION](
        state: IState, {contentUserId, proficiency, timestamp}: IAddContentInteractionMutationArgs
    ) {
        const lastEstimatedStrength = getters.contentUserLastEstimatedStrength(state, getters)(contentUserId);

        const id = contentUserId;
        const objectType = GlobalStoreObjectTypes.CONTENT_USER;
        const propertyName = ContentUserPropertyNames.PROFICIENCY;
        const type = FieldMutationTypes.SET;
        const data = proficiency;

        const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
            data, id, propertyName, timestamp, type
        };

        const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
            objectType,
            ...storeMutation
        };
        state.globalDataStore.addMutation(globalMutation);

        const newLastEstimatedStrength = getters.contentUserLastEstimatedStrength(state, getters)(contentUserId);
        const strengthDifference = newLastEstimatedStrength - lastEstimatedStrength;

        const userId = getUserId({contentUserId});
        const addUserMutationPointArgs: IAddUserPointsMutationArgs = {
          userId, points: strengthDifference
        };
        const store = getters.getStore();
        store.commit(MUTATION_NAMES.ADD_USER_POINTS, addUserMutationPointArgs);

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
        };
        /**
         * logic for initial stuff up there ^^^^
         *
         if (this.sampleContentUser1Proficiency > PROFICIENCIES.ONE && !this.hasInteractions()) {
                    millisecondsSinceLastInteraction = 60 * 60 * 1000
                }
         *
         */
        const store = getters.getStore();
        store.commit(MUTATION_NAMES.CREATE_CONTENT_USER_DATA, {contentUserId, contentUserData});
        store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {contentUserId, proficiency, timestamp});
        return contentUserData
    },
    [MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state: IState, {contentUserId, contentUserData}) {
        const createMutation: ICreateMutation<ContentUserData> = {
            id: contentUserId,
            data: contentUserData,
            objectType: GlobalStoreObjectTypes.CONTENT_USER,
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
        };
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
        const store = getters.getStore();
        /**
         * Create Content
         */
        const contentId /*: id */ = (mutations as any)[MUTATION_NAMES.CREATE_CONTENT](state, {
            question, answer, title, type: contentType
        });
        const contentIdString = contentId as any as id; // TODO: Why do I have to do this casting?

        /**
         * Create Tree
         */
        const createTreeMutationArgs: ICreateTreeMutationArgs = {
            parentId: parentTreeId, contentId: contentIdString
        };
        const treeId = (mutations as any)[MUTATION_NAMES.CREATE_TREE](state, createTreeMutationArgs);
        const treeIdString = treeId as any as id;

        /**
         * Create TreeLocation
         */
        const r = 30;
        const newCoordinate: ICoordinate =
            obtainNewCoordinate(
                {r, sigmaInstance: state.sigmaInstance,
                    parentCoordinate:
                        {x: parentLocation.point.x, y: parentLocation.point.y}
                });

        // get parent tree map Id

        const parentLocationMapId = parentLocation.mapId;
        if (!parentLocationMapId) {
            throw new Error('Could not create new child tree because parentTree with id of '
                + parentTreeId + ' does not have an mapId in it\'s treeLocation object')
        }
        const createTreeLocationMutationArgs: ICreateTreeLocationMutationArgs = {
            treeId: treeIdString, x: newCoordinate.x, y: newCoordinate.y, level: parentLocation.level + 1,
            mapId: parentLocationMapId
        };

        const treeLocationData = store.commit(MUTATION_NAMES.CREATE_TREE_LOCATION, createTreeLocationMutationArgs);
        /* TODO: Why can't I type treelocationData? why are all the mutation methods being listed as void? */
        /**
         * Add the newly created tree as a child of the parent
         */
        store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {parentTreeId, childTreeId: treeId});

        return treeIdString
        },
    [MUTATION_NAMES.ADD_CHILD_TO_PARENT](state: IState,
                                         {
         parentTreeId, childTreeId,
     }) {

        const globalStoreMutation: ITypeIdProppedDatedMutation<SetMutationTypes> = {
            objectType: GlobalStoreObjectTypes.TREE,
            id: parentTreeId,
            timestamp: Date.now(),
            type: SetMutationTypes.ADD,
            propertyName: TreePropertyNames.CHILDREN,
            data: childTreeId,
        };
        state.globalDataStore.addMutation(globalStoreMutation)

        // TODO: a second mutation that sets the parentId of the child? or is that handled in another mutation?
    },
    [MUTATION_NAMES.CREATE_CONTENT](state: IState, {
        type, question,
        answer, title
    }: IContentDataEither): id {
        const createMutation: ICreateMutation<IContentData> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: GlobalStoreObjectTypes.CONTENT,
            data: {type, question, answer, title},
        };
        const contentId: id = state.globalDataStore.addMutation(createMutation);
        if (type === CONTENT_TYPES.MAP) {
        }
        return contentId
    },
    async [MUTATION_NAMES.CREATE_USER_PRIMARY_MAP](state: IState, {userName}: ICreateUserPrimaryMapMutationArgs): Promise<id> {
        log('J14I: CREATE USER PRIMARY MAP mutation called', userName);
        const createContentMutationArgs: ICreateContentMutationArgs = {
            type: CONTENT_TYPES.CATEGORY,
            title: userName,
        };
        log('J14I: CREATE USER PRIMARY MAP CREATE CONTEN MUTATION ABOUT TO BE CALLED', createContentMutationArgs);
        const userPrimaryMapRootTreeContentId: void =
            (mutations as any)[MUTATION_NAMES.CREATE_CONTENT](state, createContentMutationArgs);
        log('J14I: CREATE USER PRIMARY MAP CREATE CONTENT MUTATION' +
            ' FINISHED BEING CALLED. the created content id is', userPrimaryMapRootTreeContentId);
        const userPrimaryMapRootTreeContentIdString: id = userPrimaryMapRootTreeContentId as any as id;
        const createMapAndRootTreeIdMutationArgs: ICreateMapAndRootTreeIdMutationArgs = {
           contentId: userPrimaryMapRootTreeContentIdString
   };
        const userRootMapId: id =
            await (mutations as any)[MUTATION_NAMES.CREATE_MAP_AND_ROOT_TREE_ID](
                state, createMapAndRootTreeIdMutationArgs) /* void */ as any as id;
        log('J14I: CREATE USER PRIMARY MAP - CREATE MAP AND ROOT TREE ID MUTATION JUST CALLED.',
            ' the resulting userRootMapid id', userRootMapId);
        return userRootMapId
   },
   async [MUTATION_NAMES.CREATE_PRIMARY_USER_MAP_IF_NOT_CREATED](
        state: IState, {user, userData}: ICreatePrimaryUserMapIfNotCreatedMutationArgs) {
        log('J14I: CREATE PRIMARY USER MAP IF NOT CREATED ', user, userData);
        const userRootMapId = userData.rootMapId;
        if (userRootMapId) {
           return
       }
        log('J14I: CREATE PRIMARY USER MAP IF NOT CREATED userRootMapId does not exist!! ');
        const createUserPrimaryMapMutationArgs: ICreateUserPrimaryMapMutationArgs = {
           userName: userData.userInfo.displayName
       };
        log('J14I: CREATE PRIMARY USER MAP IF NOT CREATED create User Primary map about to be called ');
        const rootMapId: id = await (mutations as any)[MUTATION_NAMES.CREATE_USER_PRIMARY_MAP](
           state, createUserPrimaryMapMutationArgs) as any as id;
        log('J14I: CREATE PRIMARY USER MAP IF NOT CREATED create User Primary map just called ');

        log('J14I: About to set user rootMapId to be ', rootMapId);
        const userSetRootMapIdMutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames> = {
           propertyName: UserPropertyNames.ROOT_MAP_ID,
           timestamp: Date.now(),
           type: FieldMutationTypes.SET,
           data: rootMapId
       };
        user.addMutation(userSetRootMapIdMutation);
        log('J14I: user rootMapId just set . user val is now ', user.val())
    },
   async [MUTATION_NAMES.CREATE_MAP_AND_ROOT_TREE_ID](state: IState, {contentId}: ICreateMapAndRootTreeIdMutationArgs): Promise<id> {
        const store = getters.getStore();
        const createTreeMutationArgs: ICreateTreeMutationArgs = {
            parentId: NON_EXISTENT_ID,
            contentId,
            children: [],
        };
        const rootTreeId: void = (mutations as any)[MUTATION_NAMES.CREATE_TREE](state, createTreeMutationArgs);
        const rootTreeIdString = rootTreeId as any as id;
        const createMapMutationArgs: ICreateMapMutationArgs = {
            rootTreeId: rootTreeIdString,
        };
        const mapId = await (mutations as any)[MUTATION_NAMES.CREATE_MAP](state, createMapMutationArgs) as any as id;
        const createTreeLocationMutationArgs: ICreateTreeLocationMutationArgs = {
           treeId: rootTreeIdString,
           level: 1,
           x: MAP_DEFAULT_X,
           y: MAP_DEFAULT_Y,
           mapId,
       };
       (mutations as any)[MUTATION_NAMES.CREATE_TREE_LOCATION](state, createTreeLocationMutationArgs);
        const mapIdString = mapId as any as id;
        return mapIdString
    },
    async [MUTATION_NAMES.CREATE_MAP](state: IState, {rootTreeId}: ICreateMapMutationArgs): Promise<id> {
        const objectAndId: ICreateBranchesMapReturnObject
        = await state.branchesMapUtils.createBranchesMapInDBAndAutoSave({rootTreeId});
        const branchesMapId = objectAndId.id;
        const branchesMap = objectAndId.branchesMap;
        storeBranchesMapInStateAndSubscribe({branchesMap, branchesMapId, state});
        return branchesMapId
    },
    async [MUTATION_NAMES.LOAD_MAP_IF_NOT_LOADED](
        state: IState, {branchesMapId}: ILoadMapMutationArgs): Promise<ISyncableMutableSubscribableBranchesMap> {
        log('J14I: loadMap if not loaded called with ', branchesMapId);
        let branchesMap: ISyncableMutableSubscribableBranchesMap
            = state.branchesMaps[branchesMapId];
        if (branchesMap) {
            return branchesMap
        }
        branchesMap = await state.branchesMapLoader.loadIfNotLoaded(branchesMapId);
        log('J14I: loadMap if not loaded. the branchesMap retrieved is ', branchesMap);
        /* TODO: i could see how if a map was created via branchesMapUtils
        that it would mark as not loaded inside of branchesMapLoader.loadIfNotLoaded */
        storeBranchesMapInStateAndSubscribe({branchesMap, branchesMapId, state});
        return branchesMap
    },
    async [MUTATION_NAMES.LOAD_MAP_AND_ROOT_SIGMA_NODE](
        state: IState, {branchesMapId}: ILoadMapAndRootSigmaNodeMutationArgs) {
        // if (state.branchesMaps[branchesMapId]) {
        //     return
        // }
        log('loadMapAndRootSigmaNode called ', branchesMapId);
        const loadMapMutationArgs: ILoadMapMutationArgs = {
            branchesMapId
        };
        const branchesMap: ISyncableMutableSubscribableBranchesMap
            = await (mutations as any)[MUTATION_NAMES.LOAD_MAP_IF_NOT_LOADED](state, loadMapMutationArgs) as any;
        log('loadMapAndRootSigmaNode loadedBranchesMap is  ', branchesMap);
        const branchesMapVal = branchesMap.val();
        const rootTreeId = branchesMapVal.rootTreeId;
        state.sigmaNodeLoader.loadIfNotLoaded(rootTreeId)
        // state.fa
        /* TODO: i could see how if a map was created via branchesMapUtils
        that it would mark as not loaded inside of branchesMapLoader.loadIfNotLoaded */
        // storeBranchesMapInStateAndSubscribe({branchesMap, branchesMapId, state})
        // return branchesMap
    },
    [MUTATION_NAMES.EDIT_FACT](state: IState, {contentId, question, answer}: IEditFactMutationArgs) {
        const editQuestionMutation: IEditMutation<ContentPropertyMutationTypes> = {
            objectType: GlobalStoreObjectTypes.CONTENT,
            type: FieldMutationTypes.SET,
            id: contentId,
            propertyName: ContentPropertyNames.QUESTION,
            timestamp: Date.now(),
            data: question,
        };
        const editAnswerMutation: IEditMutation<ContentPropertyMutationTypes> = {
            objectType: GlobalStoreObjectTypes.CONTENT,
            type: FieldMutationTypes.SET,
            id: contentId,
            propertyName: ContentPropertyNames.ANSWER,
            timestamp: Date.now(),
            data: answer,
        };
        state.globalDataStore.addMutation(editQuestionMutation);
        state.globalDataStore.addMutation(editAnswerMutation)
    },
    [MUTATION_NAMES.EDIT_CATEGORY](state: IState, {contentId, title}: IEditCategoryMutationArgs) {
        const editCategoryMutation: IEditMutation<ContentPropertyMutationTypes> = {
            objectType: GlobalStoreObjectTypes.CONTENT,
            type: FieldMutationTypes.SET,
            id: contentId,
            propertyName: ContentPropertyNames.TITLE,
            timestamp: Date.now(),
            data: title,
        };
        state.globalDataStore.addMutation(editCategoryMutation)
    },
    [MUTATION_NAMES.PLAY_TREE](state: IState, {treeId}: IPlayTreeMutationArgs ){
        const store = getters.getStore()
        const flashcardTreeFactory = new FlashcardTreeFactory({store})
        const userId = state.userId
        const flashcardTree = flashcardTreeFactory.createFlashcardTree({treeId, userId})
        const heap = new Heap<IFlashcardTreeData>((flashcardData1: IFlashcardTreeData, flashcardData2: IFlashcardTreeData) => {
            const nextReviewTime1: timestamp = flashcardData1.contentUser.nextReviewTime.val()
            const nextReviewTime2: timestamp = flashcardData2.contentUser.nextReviewTime.val()
            return nextReviewTime2 - nextReviewTime1
        })
        for (const flashcardData of Array.from(flashcardTree) as IFlashcardTreeData[]){
            heap.push(flashcardData)
        }
        state.interactionMode = INTERACTION_MODES.PLAYING
        state.currentlyPlayingTreeId = treeId
        state.currentStudyHeap = heap
        store.commit(MUTATION_NAMES.ZOOM_IN_ON_NEXT_NODE_TO_STUDY_OR_PAUSE_IF_NONE)
    },
    [MUTATION_NAMES.ZOOM_IN_ON_NEXT_NODE_TO_STUDY_OR_PAUSE_IF_NONE](state: IState){
        const flashcardToStudyTreeData: IFlashcardTreeData = state.currentStudyHeap.pop()
        const treeIdToStudy = flashcardToStudyTreeData.treeId
        const store = getters.getStore()

        const jumpToMutationArgs: IJumpToMutationArgs = {treeId: treeIdToStudy}
        store.commit(MUTATION_NAMES.JUMP_TO, jumpToMutationArgs)
    },
    [MUTATION_NAMES.CREATE_TREE](state: IState, {parentId, contentId, children = []}: ICreateTreeMutationArgs): id {
        const createMutation: ICreateMutation<ITreeDataWithoutId> = {
            objectType: GlobalStoreObjectTypes.TREE,
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            data: {parentId, contentId, children},
        };
        const treeId = state.globalDataStore.addMutation(createMutation);
        return treeId
    },
    [MUTATION_NAMES.CREATE_TREE_LOCATION](
        state: IState,
        {
            treeId, x, y, level, mapId
        }: ICreateTreeLocationMutationArgs
    ): ITreeLocationData {
        const createMutation: ICreateMutation<ITreeLocationData> = {
            type: STORE_MUTATION_TYPES.CREATE_ITEM,
            objectType: GlobalStoreObjectTypes.TREE_LOCATION,
            data: {
                point: {
                    x, y,
                },
                level,
                mapId,
            },
            id: treeId
        };
        const treeLocationData = state.globalDataStore.addMutation(createMutation);
        return treeLocationData
    },
    [MUTATION_NAMES.MOVE_TREE_COORDINATE](state: IState, {treeId, point }: IMoveTreeCoordinateMutationArgs) {
        const mutation: ITypeIdProppedDatedMutation<PointMutationTypes> = {
            objectType: GlobalStoreObjectTypes.TREE_LOCATION,
            id: treeId,
            timestamp: Date.now(),
            type: PointMutationTypes.SET,
            propertyName: TreeLocationPropertyNames.POINT,
            data: {point},
        };

        state.globalDataStore.addMutation(mutation)
    },
    [MUTATION_NAMES.ADD_NODE](state: IState, {node}: IAddNodeMutationArgs) {
        if (state.sigmaInitialized) {
            state.graph.addNode(node);
            (mutations as any)[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
        } else {
            state.graphData.nodes.push(node)
        }
    },
    [MUTATION_NAMES.ADD_EDGES](state: IState, {edges}: IAddEdgeMutationArgs) {
        if (state.sigmaInitialized) {
            for (const edge of edges){
                state.graph.addEdge(edge)
            }
            (mutations as any)[MUTATION_NAMES.REFRESH](state, null) // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
        } else {
            state.graphData.edges.push(...edges)
        }
    },
    async [MUTATION_NAMES.LOGIN](state: IState, {userId}) {
    },
    async [MUTATION_NAMES.CREATE_USER_OR_LOGIN](state: IState, {userId, userInfo}: ICreateUserOrLoginMutationArgs) {
        log('J14I: CreateUserOrLogin mutation called with ', userId, userInfo);
        if (!userId) {
            throw new RangeError('UserId cannot be blank')
        }
        if (state.userId) {
            throw new Error('Can\'t log user with id of ' + userId
                + ' in!. There is already a user logged in with id of ' + state.userId)
        }
        const store = getters.getStore();
        const userExistsInDB = await state.userUtils.userExistsInDB(userId);
        let user: ISyncableMutableSubscribableUser;
        if (!userExistsInDB) {
            user = await state.userUtils.createUserInDB({userId, userInfo})
        } else {
            user = await state.userLoader.downloadUser(userId)
        }
        storeUserInStateAndSubscribe({user, userId, state});
        const setUserIdMutationArgs: ISetUserIdMutationArgs = {
            userId
        };
        store.commit(MUTATION_NAMES.SET_USER_ID, setUserIdMutationArgs);

        const saveUserInfoFromLoginProvider: ISaveUserInfoFromLoginProviderMutationArgs = {
            userId,
            userInfo,
        };
        store.commit(MUTATION_NAMES.SAVE_USER_INFO_FROM_LOGIN_PROVIDER, saveUserInfoFromLoginProvider);

        /* TODO: we should really be passing these user mutations through the
        globalDataStore mutation funnel . .. or maybe not . .. idk yet
         */
        const createPrimaryUserMapIfNotCreatedArgs: ICreatePrimaryUserMapIfNotCreatedMutationArgs = {
            userData: user.val(),
            user,
        };
        store.commit(MUTATION_NAMES.CREATE_PRIMARY_USER_MAP_IF_NOT_CREATED, createPrimaryUserMapIfNotCreatedArgs)

        // TODO: once we have firebase priveleges, we may not be able to check if the user exists or not

    },
    [MUTATION_NAMES.SET_USER_DATA](state: IState, {userId, userData}: ISetUserDataMutationArgs) {
        Vue.set(state.usersData, userId, userData);
        Vue.set(state, 'usersDataHashmapUpdated', Math.random())
    },
    [MUTATION_NAMES.SET_MEMBERSHIP_EXPIRATION_DATE](
        state: IState, {membershipExpirationDate, userId}: ISetMembershipExpirationDateArgs) {
        const user: IMutableSubscribableUser = state.users[userId];
        const membershipDateMutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> = {
            propertyName: UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: membershipExpirationDate
        };
        const activatedMutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> = {
            propertyName: UserPropertyNames.EVER_ACTIVATED_MEMBERSHIP,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: true
        };
        user.addMutation(membershipDateMutation);
        user.addMutation(activatedMutation);
        const userData: IUserData = user.val();
        const store: Store<any> = getters.getStore();
        const mutationArgs: ISetUserDataMutationArgs = {
            userId,
            userData
        };
        // TODO: just have an onUpdate to user trigger store mutation rather than directly calling this mutation
        store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs)
        // this will trigger the
    },
    [MUTATION_NAMES.LOGIN_WITH_FACEBOOK](state: IState) {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
        //     redirect_uri: window.location.protocol + '//' + window.location.hostname
            display: 'touch'
        });
        const store: Store<any> = getters.getStore();
        firebase.auth().signInWithRedirect(provider).then( (result) => {
            log('user result is', result, result.user);
            const userInfo: firebase.UserInfo = result.user;
            const userId = userInfo.uid;
            const createUserOrLoginMutationArgs: ICreateUserOrLoginMutationArgs = {
                userId,
                userInfo,
            };
            store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, createUserOrLoginMutationArgs)

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            error('There was an error ', errorCode, errorMessage, email, credential)
        });

    },
    [MUTATION_NAMES.SAVE_USER_INFO_FROM_LOGIN_PROVIDER](state: IState,
                                                        {userId, userInfo}: ISaveUserInfoFromLoginProviderMutationArgs) {
        const user = state.users[userId];
        const mutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames> = {
            propertyName: UserPropertyNames.USER_INFO,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: userInfo
        };
        user.addMutation(mutation)
    },
    // TODO: we also need a mutation called SET_MAP_ID_AND_ZOOM_TO_ROOT_TREE_ID
    [MUTATION_NAMES.SWITCH_TO_LAST_USED_MAP](state: IState) {
        const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
            branchesMapId: GLOBAL_MAP_ID // hardcode last used map as GLOBAL_MAP_ID for now
        };
        const store = getters.getStore();
        store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapMutationArgs)
    },
    [MUTATION_NAMES.SWITCH_TO_GLOBAL_MAP](state: IState) {
        log('J14I: Switch to Global Map called ');
        const store = getters.getStore();
        const switchToMapArgs: ISwitchToMapMutationArgs = {
            branchesMapId: GLOBAL_MAP_ID
        };
        store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapArgs)
        // TODO: more specifically switch to the submap they were on on the global map?
    },
    [MUTATION_NAMES.SWITCH_TO_PERSONAL_MAP](state: IState) {
        log('J14I: Switch to Personal Map called ');
        const store = getters.getStore();
        const userData: IUserData = state.usersData[state.userId];
        log('J14I: Switch to Personal Map, userData is ', userData);
        const personalMapId = userData.rootMapId;
        const switchToMapArgs: ISwitchToMapMutationArgs = {
            branchesMapId: personalMapId
        };
        store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapArgs)
        // TODO: more specifically switch to the submap they were on on the personal map?
    },
    [MUTATION_NAMES.SWITCH_TO_MAP](state: IState, {branchesMapId}: ISwitchToMapMutationArgs) {
        log('J14I: Switch to map called', branchesMapId);
        const store = getters.getStore();

        const loadMapMutationArgs: ILoadMapAndRootSigmaNodeMutationArgs = {
            branchesMapId
        };

        store.commit(MUTATION_NAMES.LOAD_MAP_AND_ROOT_SIGMA_NODE, loadMapMutationArgs);
        // MUTATION_NAMES.ZOOM_TO_LAST_LOCATION_USER_WAS_AT_ON_THE_MAP
        store.commit(MUTATION_NAMES.SET_MAP_ID, loadMapMutationArgs);
        store.commit(MUTATION_NAMES.REFRESH)
    },
    [MUTATION_NAMES.SET_MAP_ID](state: IState, {branchesMapId}: ISetBranchesMapIdMutationArgs) {
        if (!state.sigmaInitialized) {
            throw new Error('Cannot set map id before sigma has been initialized.' +
                ' because the renderer we are trying to set the mapIdOn is null')
        }
        state.currentMapId = branchesMapId;
        state.renderer.mapIdToRender = branchesMapId // TODO: fix pathological coupling with the sigma renderer class
    },
    [MUTATION_NAMES.SET_TREE_DATA](state: IState, {treeId, treeDataWithoutId}: ISetTreeDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.trees, treeId, treeDataWithoutId)
    },
    [MUTATION_NAMES.SET_TREE_LOCATION_DATA](state: IState,
                                            {treeId, treeLocationData}: ISetTreeLocationDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.treeLocations, treeId, treeLocationData)
    },
    [MUTATION_NAMES.SET_TREE_USER_DATA](state: IState, {treeId, treeUserData}: ISetTreeUserDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.treeUsers, treeId, treeUserData)
    },
    [MUTATION_NAMES.SET_CONTENT_DATA](state: IState, {contentId, contentData}: ISetContentDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.content, contentId, contentData)
    },
    [MUTATION_NAMES.SET_CONTENT_USER_DATA](state: IState,
                                           {contentUserId, contentUserData }: ISetContentUserDataMutationArgs) {
        Vue.set(this.state.globalDataStoreData.contentUsers, contentUserId, contentUserData)
    },
    [MUTATION_NAMES.SET_TREE](state: IState, {treeId, tree}: ISetTreeMutationArgs) {
        Vue.set(this.state.globalDataStoreObjects.trees, treeId, tree)
        const setTreeDataMutationArgs: ISetTreeDataMutationArgs = {
            treeId,
            treeDataWithoutId: tree.val()
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.SET_TREE_DATA, setTreeDataMutationArgs)
    },
    [MUTATION_NAMES.SET_TREE_LOCATION](state: IState,
                                       {treeId, treeLocation}: ISetTreeLocationMutationArgs) {
        Vue.set(this.state.globalDataStoreObjects.treeLocations, treeId, treeLocation)
        const setTreeLocationDataMutationArgs: ISetTreeLocationDataMutationArgs = {
            treeId,
            treeLocationData: treeLocation.val()
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.SET_TREE_LOCATION_DATA, setTreeLocationDataMutationArgs)
    },
    [MUTATION_NAMES.SET_TREE_USER](state: IState, {treeId, treeUser}: ISetTreeUserMutationArgs) {
        Vue.set(this.state.globalDataStoreObjects.treeUsers, treeId, treeUser)
        const setTreeUserDataMutationArgs: ISetTreeUserDataMutationArgs = {
            treeId,
            treeUserData: treeUser.val(),
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.SET_TREE_USER, setTreeUserDataMutationArgs)
    },
    [MUTATION_NAMES.SET_CONTENT](state: IState, {contentId, content}: ISetContentMutationArgs) {
        Vue.set(this.state.globalDataStoreObjects.content, contentId, content)
        const setContentDataMutationArgs: ISetContentDataMutationArgs = {
            contentId,
            contentData: content.val(),
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.SET_TREE_USER, setContentDataMutationArgs)
    },
    [MUTATION_NAMES.SET_CONTENT_USER](state: IState,
                                      {contentUserId, contentUser }: ISetContentUserMutationArgs) {
        Vue.set(this.state.globalDataStoreObjects.contentUsers, contentUserId, contentUser)
        const setContentUserDataMutationArgs: ISetContentUserDataMutationArgs = {
            contentUserId,
            contentUserData: contentUser.val(),
        }
        const store = getters.getStore()
        store.commit(MUTATION_NAMES.SET_TREE_USER, setContentUserDataMutationArgs)
    },
};
const actions = {};

let initialized = false;
@injectable()
export default class BranchesStore {
    constructor(@inject(TYPES.BranchesStoreArgs){
        globalDataStore,
        state,
        sigmaNodeLoader,
        sigmaNodeLoaderCore,
        branchesMapLoader,
        branchesMapUtils,
        userLoader,
        userUtils,
        sigmaFactory,
    }: BranchesStoreArgs) {
        if (initialized) {
            return {} as Store<any>
            // DON"T let the store singleton be messed up
        }
        const stateArg: IState = {
            ...state,
            globalDataStore,
            sigmaNodeLoader,
            sigmaNodeLoaderCore,
            branchesMapLoader,
            branchesMapUtils,
            userLoader,
            userUtils,
            sigmaFactory,
        };
        const store = new Store({
            state: stateArg,
            mutations,
            actions,
            getters,
        } ) as Store<any>;
        getters.getStore = () => store;
        store['globalDataStore'] = globalDataStore; // added just to pass injectionWorks test
        store['userLoader'] = userLoader; // added just to pass injectionWorks test
        store['sigmaNodeLoader'] = sigmaNodeLoader; // added just to pass injectionWorks test
        store['sigmaNodeLoaderCore'] = sigmaNodeLoaderCore; // added just to pass injectionWorks test
        store['branchesMapLoader'] = branchesMapLoader;
        store['branchesMapUtils'] = branchesMapUtils;
        store['sigmaFactory'] = sigmaFactory; // added just to pass injectionWorks test
        store['userUtils'] = userUtils; // added just to pass injectionWorks test
        store['_id'] = Math.random();
        initialized = true;
        return store
    }
}
@injectable()
export class BranchesStoreArgs {
    @inject(TYPES.IMutableSubscribableGlobalStore) public globalDataStore;
    @inject(TYPES.IUserLoader)
    @tagged(TAGS.AUTO_SAVER, true) public userLoader: IUserLoader;
    @inject(TYPES.ISigmaNodeLoader)
        public sigmaNodeLoader: ISigmaNodeLoader;
    @inject(TYPES.ISigmaNodeLoaderCore)
        public sigmaNodeLoaderCore: ISigmaNodeLoaderCore;
    @inject(TYPES.IBranchesMapUtils)
        public branchesMapUtils: IBranchesMapUtils;
    @inject(TYPES.IBranchesMapLoader)
        public branchesMapLoader: IBranchesMapLoader;
    @inject(TYPES.BranchesStoreState) public state: IState;
    @inject(TYPES.ISigmaFactory) public sigmaFactory: ISigmaFactory;
    @inject(TYPES.IUserUtils) public userUtils: IUserUtils
}

function storeUserInStateAndSubscribe(
    {user, state, userId}: {user: ISyncableMutableSubscribableUser, state: IState, userId: id}) {

    const store = getters.getStore();
    user.onUpdate((userVal: IUserData) => {
        const mutationArgs: ISetUserDataMutationArgs = {
            userData: userVal,
            userId,
        };
        store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs)
    });
    user.startPublishing();
    state.users[userId] = user;
    state.usersData[userId] = user.val()
}
function storeBranchesMapInStateAndSubscribe(
    {state, branchesMapId, branchesMap}:
        {state: IState, branchesMap: ISyncableMutableSubscribableBranchesMap, branchesMapId: id}) {

    const store = getters.getStore();
    branchesMap.onUpdate((branchesMapVal: IBranchesMapData) => {
        const mutationArgs: ISetBranchesMapDataMutationArgs = {
            branchesMapData: branchesMapVal,
            branchesMapId,
        };
        store.commit(MUTATION_NAMES.SET_BRANCHES_MAP_DATA, mutationArgs)
    });
    branchesMap.startPublishing();
    state.branchesMaps[branchesMapId] = branchesMap;
    state.branchesMapsData[branchesMapId] = branchesMap.val()
}
