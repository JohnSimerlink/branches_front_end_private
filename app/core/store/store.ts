import * as Vuex
	from 'vuex';
import {Store} from 'vuex';
import {
	error,
	log
} from '../log';
import {
	DEFAULT_JUMP_TO_ZOOM_RATIO,
	DEFAULT_NEW_TREE_POINTS,
	GLOBAL_MAP_ID,
	GRAPH_CONTAINER_ID,
	MAP_DEFAULT_X,
	MAP_DEFAULT_Y,
	NON_EXISTENT_ID
} from '../globals';
import {
	CONTENT_TYPES,
	ContentPropertyMutationTypes,
	ContentPropertyNames,
	ContentUserPropertyNames,
	FieldMutationTypes,
	GlobalStoreObjectTypes,
	IAddContentInteractionMutationArgs,
	IAddEdgeMutationArgs,
	IAddNodeMutationArgs,
	IAddUserPointsMutationArgs,
	IBranchesMapData,
	IBranchesMapLoader,
	IBranchesMapUtils,
	IContentData,
	IContentDataEither,
	IContentUserData,
	ICoordinate,
	ICreateBranchesMapReturnObject,
	ICreateContentMutationArgs,
	ICreateMapAndRootTreeIdMutationArgs,
	ICreateMapMutationArgs,
	ICreateMutation,
	ICreatePrimaryUserMapIfNotCreatedMutationArgs,
	ICreateTreeLocationMutationArgs,
	ICreateTreeMutationArgs,
	ICreateUserOrLoginMutationArgs,
	ICreateUserPrimaryMapMutationArgs,
	ICreateUserWithEmailMutationArgs,
	id,
	IEditCardLocallyMutationArgs,
	IEditCardTitleLocallyMutationArgs,
	IEditCategoryMutationArgs,
	IEditFlashcardMutationArgs,
	IEditMutation,
	IFamilyLoader,
	IFlipCardMutationArgs,
	IIdProppedDatedMutation,
	ILoadMapAndRootSigmaNodeMutationArgs,
	ILoadMapMutationArgs,
	ILoginWithEmailMutationArgs, IMapInteractionState,
	IMapStateManager,
	IMutableSubscribableUser,
	IOneToManyMap,
	IProppedDatedMutation,
	ISaveUserInfoFromLoginProviderMutationArgs,
	ISetBranchesMapDataMutationArgs,
	ISetBranchesMapIdMutationArgs,
	ISetCardOpenMutationArgs,
	ISetEditingCardMutationArgs,
	ISetHoveringCardMutationArgs,
	ISetMembershipExpirationDateArgs,
	ISetUserDataMutationArgs,
	ISetUserIdMutationArgs,
	ISigmaEventListener,
	ISigmaFactory,
	ISigmaNodeLoader,
	ISigmaNodeLoaderCore,
	IState,
	IStoreGetters,
	ISwitchToMapMutationArgs,
	ISyncableMutableSubscribableBranchesMap,
	ISyncableMutableSubscribableUser,
	ITooltipConfigurer,
	ITooltipOpener,
	ITreeDataWithoutId,
	ITreeLocationData,
	ITypeIdProppedDatedMutation,
	IUserData,
	IUserLoader,
	IUserUtils, MapInteractionStateKeys,
	PointMutationTypes,
	SetMutationTypes,
	STORE_MUTATION_TYPES,
	timestamp,
	TreeLocationPropertyNames,
	TreePropertyNames,
	UserPropertyMutationTypes,
	UserPropertyNames,
} from '../../objects/interfaces';
import {SigmaEventListener} from '../../objects/sigmaEventListener/sigmaEventListener';
import {TooltipOpener} from '../../objects/tooltipOpener/tooltipOpener';
import {TYPES} from '../../objects/types';
import {
	inject,
	injectable,
	tagged
} from 'inversify';
import {TooltipConfigurer} from '../../objects/tooltipOpener/tooltipConfigurer';
import {myContainer} from '../../../inversify.config';
import {obtainNewCoordinate} from '../../objects/treeLocation/determineNewLocation';
import {TAGS} from '../../objects/tags';
import * as firebase
	from 'firebase';
import {getUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {
	IAddChildToParentArgs,
	IDisplayNextReviewTimeMessageMutationArgs,
	IDisplayOverdueMessageMutationArgs,
	IHighlightFlashcardNodeArgs,
	IJumpToMutationArgs,
	IMoveTreeCoordinateByDeltaMutationArgs,
	IMoveTreeCoordinateMutationArgs,
	INewChildTreeMutationArgs,
	IPlayTreeMutationArgs,
	ISetContentDataMutationArgs,
	ISetContentMutationArgs,
	ISetContentUserDataMutationArgs,
	ISetContentUserMutationArgs,
	ISetTreeDataMutationArgs,
	ISetTreeLocationDataMutationArgs,
	ISetTreeLocationMutationArgs,
	ISetTreeMutationArgs,
	ISetTreeUserDataMutationArgs,
	ISetTreeUserMutationArgs,
} from './store_interfaces';
import {FlashcardTreeFactory} from '../../objects/flashcardTree/FlashcardTreeFactory'
import {MUTATION_NAMES} from './STORE_MUTATION_NAMES'
import {getters} from './store_getters'
import {IFlashcardTreeData} from '../../objects/flashcardTree/IFlashcardTreeData'
import {INTERACTION_MODES} from './interactionModes';
import {FlashcardTreeUtils} from '../../objects/flashcardTree/FlashcardTreeUtils';
import {printStateOfFlashcardTreeHeap} from '../../objects/flashcardTree/HeapUtils';
import {getUserInfoFromEmailLoginResult} from '../../objects/user/userHelper';
import {
	messageError,
	messageNotification,
	messageReviewNotification
} from '../../message';
import {getOverdueMessageFromContent} from '../../loaders/contentUser/ContentUserLoaderAndOverdueListener';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import moment = require('moment');
import {InteractionStateActionProcessor} from '../../objects/interactionStateProcessor/interactionStateProcessor';

const Heap = require('heap').default || require('heap')
let Vue = require('vue').default || require('vue');
Vue.use(Vuex);

const mutations = {
	[MUTATION_NAMES.UPDATE_MAP_INTERACTION_STATE](state: IState, mapInteractionState: IMapInteractionState) {
		Object.values(MapInteractionStateKeys).forEach(key => {
			state[key] = mapInteractionState[key]
		});
		// Object.keys(mapInteractionState).forEach(key => {
		// })
	},
	[MUTATION_NAMES.DISPLAY_NEXT_REVIEW_TIME_MESSAGE](state: IState, {points, nextReviewTimeString, color}: IDisplayNextReviewTimeMessageMutationArgs) {

		const ptsString: string = points > 0 ? `+${Math.floor(points)}` : '' + Math.floor(points);
		const text = `${ptsString} pts! Review ${nextReviewTimeString}`;
		messageNotification(
			{
				// backgroundColor,
				color,
				text,
				onclick: (snack) => {
					snack.hide();
				}
			}
		);

	},
	[MUTATION_NAMES.DISPLAY_OVERDUE_MESSAGE](state: IState, {contentId}: IDisplayOverdueMessageMutationArgs) {
		const content: IContentData = state.globalDataStoreData.content[contentId]
		const text = getOverdueMessageFromContent(content)
		const treeIds: id[] = state.contentIdSigmaIdsMap.get(contentId)
		const treeId = treeIds[0]; // jump to the first tree that has that contentId
		const store = getters.getStore();
		const jumpToTree = () => {
			const jumpToMutationArgs: IJumpToMutationArgs = {
				treeId
			}
			store.commit(MUTATION_NAMES.JUMP_TO, jumpToMutationArgs)
		};
		if (!treeIds) {
			messageError({text: `Could not find ${content}`})
		} else {
			messageReviewNotification(
				{
					text,
					onclick: (snack) => {
						jumpToTree();
						snack.hide();
					}
				}
			)
		}

	},
	[MUTATION_NAMES.JUMP_TO](state: IState, {treeId}: IJumpToMutationArgs) {
		const store = getters.getStore();
		store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD); // close any flashcards in case some are open
		const camera = state.sigmaInstance.camera
		const {x, y} = state.globalDataStoreData.treeLocations[treeId].point
		camera.goTo({
			x,
			y,
			ratio: DEFAULT_JUMP_TO_ZOOM_RATIO
		})
	},
	[MUTATION_NAMES.ADD_USER_POINTS](state: IState, {userId, points}: IAddUserPointsMutationArgs) {
		const user = state.users[userId];

		const mutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames> = {
			propertyName: UserPropertyNames.POINTS,
			timestamp: Date.now(),
			data: points,
			type: FieldMutationTypes.ADD
		};
		user.addMutation(mutation);
	},
	/**
	 * TODO: TOO much procedural code in this method. . . . disaster/confusing bug waiting to happen.
	 * @param state
	 */
	[MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED](state: IState) {
		if (state.sigmaInitialized) {
			return;
		}
		state.sigmaFactory.init();
		const sigmaInstance /*: Sigma*/ =
			state.sigmaFactory.create({
				graph: state.graphData,
				container: GRAPH_CONTAINER_ID,
				defaultEdgeType: 'curve',
				glyphScale: 0.7,
				glyphFillColor: '#666',
				glyphTextColor: 'white',
				glyphStrokeColor: 'transparent',
				glyphFont: 'FontAwesome',
				glyphFontStyle: 'normal',
				glyphTextThreshold: 6,
				glyphThreshold: 3,
				doubleClickEnabled: false,
				settings: {
					doubleClickEnabled: false,
				}
			} as any/* as SigmaConfigs*/) as any;
		state.sigmaInstance = sigmaInstance;
		state.graph = sigmaInstance.graph;
		state.sigmaInitialized = true;
		if (typeof window !== 'undefined') { // for debuggin only. NOT to be used by other classes
			const windowAny: any = window;
			windowAny.sigmaInstance = sigmaInstance;
		}

		sigmaInstance.cameras[0].goTo({
			x: 5,
			y: 5,
			ratio: .05
		});

		const renderer = sigmaInstance.renderers[0];
		state.renderer = renderer;
		/* TODO: it would be nice if I didn't have to do all this constructing
		 inside of store.ts and rather did it inside of appContainer or inversify.config.ts */
		const store = getters.getStore();
		const tooltipConfigurer: ITooltipConfigurer = new TooltipConfigurer({store});
		const tooltipsConfig = tooltipConfigurer.getTooltipsConfig();
		const tooltips = state.sigmaFactory.plugins.tooltips(sigmaInstance, renderer, tooltipsConfig);
		state.getTooltips = () => tooltips
		const tooltipOpener: ITooltipOpener =
			new TooltipOpener(
				{
					store,
					tooltipConfigurer,
					mapStateManager: state.mapStateManager,
				});
		const dragListener = state.sigmaFactory.plugins.dragNodes(sigmaInstance, renderer);
		const familyLoader: IFamilyLoader = myContainer.get<IFamilyLoader>(TYPES.IFamilyLoader);
		const interactionStateActionProcessor = myContainer.get<InteractionStateActionProcessor>(TYPES.InteractionStateActionProcessor);
		const sigmaEventListener: ISigmaEventListener
			= new SigmaEventListener({
			tooltipOpener,
			sigmaInstance,
			familyLoader,
			dragListener,
			store,
			interactionStateActionProcessor
		});
		state.mapStateManager.init();
		sigmaEventListener.startListening();
	},
	// [MUTATION_NAMES.SWAP_TOOLTIP_VUE_INSTANCE](state: IState), {vueInstance}: ISwapTooltipVueInstance {
	// 	state.vueInstance =
	// },
	[MUTATION_NAMES.ENABLE_REFRESH](state: IState) {
		state.refreshEnabled = true

	},
	[MUTATION_NAMES.DISABLE_REFRESH](state: IState) {
		state.refreshEnabled = false

	},
	[MUTATION_NAMES.REFRESH](state: IState) {
		if (!state.sigmaInitialized) {
			error('sigma is not initialized yet. we cannot call refresh');
			return;
		}
		if (!state.refreshEnabled) {
			return
		}
		state.sigmaInstance.refresh();
	},
	[MUTATION_NAMES.SET_USER_ID](state: IState, {userId}: ISetUserIdMutationArgs) {
		state.userId = userId;
		state.sigmaNodeLoaderCore.setUserId(userId);
	},
	[MUTATION_NAMES.OPEN_MOBILE_CARD](state: IState) {
		state.mobileCardOpen = true
		state.cardOpen = true
	},
	[MUTATION_NAMES.FLIP_FLASHCARD](state: IState, {sigmaId}: IFlipCardMutationArgs) {
		if (state.currentFlippedFlashcards.includes(sigmaId)) {
			state.currentFlippedFlashcards = state.currentFlippedFlashcards.filter(id => id !== sigmaId)
		} else {
			state.currentFlippedFlashcards.push(sigmaId)
		}
		if (state.hoveringCardId === sigmaId) {
			// state.hoveringCardId = null
			state.showAddButton = false
		}
		state.sigmaNodesUpdater.flip(sigmaId)
		const store = getters.getStore();
		store.commit(MUTATION_NAMES.REFRESH)
		// state.sigmaInstance.refresh()
	},
	[MUTATION_NAMES.SET_HOVERING_CARD](state: IState, {sigmaId}: ISetHoveringCardMutationArgs) {
		// can't hover a flipped flashcard, because the hover button and the confidence buttons overlap.
		state.hoveringCardId = sigmaId
		if (state.currentFlippedFlashcards.includes(sigmaId)) {
			state.showAddButton = false
			return
		}
		state.showAddButton = true
	},
	[MUTATION_NAMES.REMOVE_HOVERING_CARD](state: IState,) {
		state.hoveringCardId = null
	},
	[MUTATION_NAMES.SET_EDITING_CARD](state: IState, {sigmaId, contentId}: ISetEditingCardMutationArgs) {
		state.editingCardId = sigmaId
		state.editingCardContentId = contentId
	},
	[MUTATION_NAMES.EDIT_CARD_TITLE_LOCALLY](state: IState, {title}: IEditCardTitleLocallyMutationArgs) {
		// state.editingCard = title
	},
	[MUTATION_NAMES.EDIT_CARD_LOCALLY](state: IState, {question, answer}: IEditCardLocallyMutationArgs) {
		state.editingCardQuestion = question
		state.editingCardAnswer = answer
	},
	[MUTATION_NAMES.SAVE_LOCAL_CARD_EDIT](state: IState, {}: IEditCardTitleLocallyMutationArgs) {
		if (!state.editingCardId) {
			return
		}
		if (state.editingCardQuestion == null) {
			// console.log('!state.editingCardQuestion null', state.editingCardQuestion)
			return
		}
		if (!state.editingCardAnswer == null) {
			// console.log('!state.editingCardAnswer null', state.editingCardAnswer)
			return
		}
		const editFlashcardMutation: IEditFlashcardMutationArgs = {
			contentId: state.editingCardContentId,
			question: state.editingCardQuestion,
			answer: state.editingCardAnswer,
		};
		// console.log("cardEdit saveContentChangeLocally category called", editCategoryMutation);
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.EDIT_FLASHCARD, editFlashcardMutation);
	},
	[MUTATION_NAMES.CLOSE_LOCAL_CARD_EDIT](state: IState, {}: IEditCardTitleLocallyMutationArgs) {
		state.editingCard = null
		state.editingCardQuestion = null
		state.editingCardAnswer = null
		state.editingCardId = null
		state.editingCardContentId = null
	},
	// TODO: if contentUser does not yet exist in the DB create it.
	[MUTATION_NAMES.SET_CARD_OPEN](state: IState, {sigmaId}: ISetCardOpenMutationArgs) {
		state.cardOpen = true
		state.currentOpenTreeId = sigmaId
	},
	[MUTATION_NAMES.SET_CARD_CLOSED](state: IState) {
		// state.cardOpen = false
		// state.mobileCardOpen = false
		// state.mapStateManager.enterMainMode()
	},
	[MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD](state: IState) {
		// const tooltips = state.getTooltips()
		// tooltips.close();
		// const store = getters.getStore();
		// store.commit(MUTATION_NAMES.SET_CARD_CLOSED);
		// store.commit(MUTATION_NAMES.REFRESH);
	},
	[MUTATION_NAMES.JUMP_TO_NEXT_FLASHCARD_IF_IN_PLAYING_MODE](state: IState) {
		const store = getters.getStore();
		if (state.interactionMode !== INTERACTION_MODES.PLAYING) {
			return;
		}
		store.commit(MUTATION_NAMES.UNHIGHLIGHT_PREVIOUSLY_HIGHLIGHTED_NODE);
		store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
		store.commit(MUTATION_NAMES.REHEAPIFY_STUDY_HEAP_AND_PAUSE_IF_NO_MORE_OVERDUE);
		/** previous commit may have changed INTERACTION MODE.
		 *  Must check again if we are still indeed in playing mode
		 *  **/
		if (state.interactionMode !== INTERACTION_MODES.PLAYING) {
			return;
		}
		store.commit(MUTATION_NAMES.JUMP_TO_AND_HIGHLIGHT_NEXT_FLASHCARD_TO_STUDY);
	},
	[MUTATION_NAMES.ADD_CONTENT_INTERACTION](
		state: IState, {contentUserId, proficiency, timestamp}: IAddContentInteractionMutationArgs
	) {
		const gettersRef: IStoreGetters = getters
		const lastEstimatedStrength = gettersRef.contentUserLastEstimatedStrength(state, getters)(contentUserId);

		const objectType = GlobalStoreObjectTypes.CONTENT_USER;

		const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
			id: contentUserId,
			propertyName: ContentUserPropertyNames.PROFICIENCY,
			timestamp,
			type: FieldMutationTypes.SET,
			data: proficiency,
		};

		const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
			objectType,
			...storeMutation
		};
		state.globalDataStore.addMutation(globalMutation);

		const newLastEstimatedStrength = getters.contentUserLastEstimatedStrength(state, getters)(contentUserId);
		const strengthDifference: number = newLastEstimatedStrength - lastEstimatedStrength;
		const points = strengthDifference

		const userId = getUserId({contentUserId});
		const addUserMutationPointArgs: IAddUserPointsMutationArgs = {
			userId,
			points
		};
		const store = getters.getStore();

		const contentUserData: IContentUserData = store.getters.contentUserData(contentUserId);
		const nextReviewTimeString = moment(contentUserData.nextReviewTime).fromNow()
		const displayNextReviewTimeMutationArgs: IDisplayNextReviewTimeMessageMutationArgs = {
			nextReviewTimeString,
			points,
			color: ProficiencyUtils.getColor(contentUserData.proficiency)
		}

		store.commit(MUTATION_NAMES.ADD_USER_POINTS, addUserMutationPointArgs);
		store.commit(MUTATION_NAMES.DISPLAY_NEXT_REVIEW_TIME_MESSAGE, displayNextReviewTimeMutationArgs);
		store.commit(MUTATION_NAMES.REFRESH, null);
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
		 if (this.sampleContentUser1Proficiency > PROFICIENCIES.ONE
		 && !this.hasInteractions()) {
					millisecondsSinceLastInteraction = 60 * 60 * 1000
				}
		 *
		 */
		const store = getters.getStore();
		store.commit(MUTATION_NAMES.CREATE_CONTENT_USER_DATA, {
			contentUserId,
			contentUserData
		});
		store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
			contentUserId,
			proficiency,
			timestamp
		});
		return contentUserData;
	},
	[MUTATION_NAMES.CREATE_CONTENT_USER_DATA](state: IState, {contentUserId, contentUserData}) {
		const createMutation: ICreateMutation<IContentUserData> = {
			id: contentUserId,
			data: contentUserData,
			objectType: GlobalStoreObjectTypes.CONTENT_USER,
			type: STORE_MUTATION_TYPES.CREATE_ITEM,
		};
		state.globalDataStore.addMutation(createMutation);
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
			question,
			answer,
			title,
			type: contentType
		});
		const contentIdString = contentId as any as id; // TODO: Why do I have to do this casting?

		/**
		 * Create Tree
		 */
		const createTreeMutationArgs: ICreateTreeMutationArgs = {
			parentId: parentTreeId,
			contentId: contentIdString
		};
		const treeId = (mutations as any)[MUTATION_NAMES.CREATE_TREE](state, createTreeMutationArgs);
		const treeIdString = treeId as any as id;

		/**
		 * Create TreeLocation
		 */
		const r = 25;
		const newCoordinate: ICoordinate =
			obtainNewCoordinate(
				{
					r,
					sigmaInstance: state.sigmaInstance,
					parentCoordinate:
						{
							x: parentLocation.point.x,
							y: parentLocation.point.y
						}
				});

		// get parent tree map Id

		const parentLocationMapId = parentLocation.mapId;
		if (!parentLocationMapId) {
			throw new Error('Could not create new child tree because parentTree with id of '
				+ parentTreeId + ' does not have an mapId in it\'s treeLocation object');
		}
		const createTreeLocationMutationArgs: ICreateTreeLocationMutationArgs = {
			treeId: treeIdString,
			x: newCoordinate.x,
			y: newCoordinate.y,
			level: parentLocation.level + 1,
			mapId: parentLocationMapId
		};

		const treeLocationData = store.commit(MUTATION_NAMES.CREATE_TREE_LOCATION, createTreeLocationMutationArgs);
		/* TODO: Why can't I type treelocationData? why are all the mutation methods being listed as void? */
		/**
		 * Add the newly created tree as a child of the parent
		 */
		store.commit(MUTATION_NAMES.ADD_CHILD_TO_PARENT, {
			parentTreeId,
			childTreeId: treeId
		});

		const addUserMutationPointArgs: IAddUserPointsMutationArgs = {
			userId: state.userId,
			points: DEFAULT_NEW_TREE_POINTS
		};
		store.commit(MUTATION_NAMES.ADD_USER_POINTS, addUserMutationPointArgs);

		return treeIdString;
	},
	[MUTATION_NAMES.ADD_CHILD_TO_PARENT](state: IState, {parentTreeId, childTreeId}: IAddChildToParentArgs) {
		const globalStoreMutation: ITypeIdProppedDatedMutation<SetMutationTypes> = {
			objectType: GlobalStoreObjectTypes.TREE,
			id: parentTreeId,
			timestamp: Date.now(),
			type: SetMutationTypes.ADD,
			propertyName: TreePropertyNames.CHILDREN,
			data: childTreeId,
		};
		state.globalDataStore.addMutation(globalStoreMutation);

		// TODO: a second mutation that sets the parentId of the child? or is that handled in another mutation?
	},
	[MUTATION_NAMES.CREATE_CONTENT](state: IState, {
		type, question,
		answer, title
	}: IContentDataEither): id {
		const createMutation: ICreateMutation<IContentData> = {
			type: STORE_MUTATION_TYPES.CREATE_ITEM,
			objectType: GlobalStoreObjectTypes.CONTENT,
			data: {
				type,
				question,
				answer,
				title
			},
		};
		const contentId: id = state.globalDataStore.addMutation(createMutation);
		if (type === CONTENT_TYPES.MAP) {
		}
		return contentId;
	},
	async [MUTATION_NAMES.CREATE_USER_PRIMARY_MAP](state: IState,
																								 {userName}: ICreateUserPrimaryMapMutationArgs): Promise<id> {
		const createContentMutationArgs: ICreateContentMutationArgs = {
			type: CONTENT_TYPES.CATEGORY,
			title: userName,
		};
		const userPrimaryMapRootTreeContentId: void =
			(mutations as any)[MUTATION_NAMES.CREATE_CONTENT](state, createContentMutationArgs);
		const userPrimaryMapRootTreeContentIdString: id = userPrimaryMapRootTreeContentId as any as id;
		const createMapAndRootTreeIdMutationArgs: ICreateMapAndRootTreeIdMutationArgs = {
			contentId: userPrimaryMapRootTreeContentIdString
		};
		const userRootMapId: id =
			await (mutations as any)[MUTATION_NAMES.CREATE_MAP_AND_ROOT_TREE_ID](
				state, createMapAndRootTreeIdMutationArgs) /* void */ as any as id;
		return userRootMapId;
	},
	async [MUTATION_NAMES.CREATE_PRIMARY_USER_MAP_IF_NOT_CREATED](
		state: IState, {user, userData}: ICreatePrimaryUserMapIfNotCreatedMutationArgs) {
		console.log('create primary user map if not created called', userData)
		const userRootMapId = userData.rootMapId;
		if (userRootMapId) {
			return
		}
		const createUserPrimaryMapMutationArgs: ICreateUserPrimaryMapMutationArgs = {
			userName: userData.userInfo.displayName || userData.userInfo.email
		};
		const rootMapId: id = await (mutations as any)[MUTATION_NAMES.CREATE_USER_PRIMARY_MAP](
			state, createUserPrimaryMapMutationArgs) as any as id;

		const userSetRootMapIdMutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames> = {
			propertyName: UserPropertyNames.ROOT_MAP_ID,
			timestamp: Date.now(),
			type: FieldMutationTypes.SET,
			data: rootMapId
		};
		user.addMutation(userSetRootMapIdMutation);
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
		return mapIdString;
	},
	async [MUTATION_NAMES.CREATE_MAP](state: IState, {rootTreeId}: ICreateMapMutationArgs): Promise<id> {
		const objectAndId: ICreateBranchesMapReturnObject
			= await state.branchesMapUtils.createBranchesMapInDBAndAutoSave({rootTreeId});
		const branchesMapId = objectAndId.id;
		const branchesMap = objectAndId.branchesMap;
		storeBranchesMapInStateAndSubscribe({
			branchesMap,
			branchesMapId,
			state
		});
		return branchesMapId;
	},
	async [MUTATION_NAMES.LOAD_MAP_IF_NOT_LOADED](
		state: IState, {branchesMapId}: ILoadMapMutationArgs): Promise<ISyncableMutableSubscribableBranchesMap> {
		let branchesMap: ISyncableMutableSubscribableBranchesMap
			= state.branchesMaps[branchesMapId];
		if (branchesMap) {
			return branchesMap;
		}
		branchesMap = await state.branchesMapLoader.loadIfNotLoaded(branchesMapId);
		/* TODO: i could see how if a map was created via branchesMapUtils
		that it would mark as not loaded inside of branchesMapLoader.loadIfNotLoaded */
		storeBranchesMapInStateAndSubscribe({
			branchesMap,
			branchesMapId,
			state
		});
		return branchesMap;
	},
	async [MUTATION_NAMES.LOAD_MAP_AND_ROOT_SIGMA_NODE](
		state: IState, {branchesMapId}: ILoadMapAndRootSigmaNodeMutationArgs) {
		const loadMapMutationArgs: ILoadMapMutationArgs = {
			branchesMapId
		};
		const branchesMap: ISyncableMutableSubscribableBranchesMap
			= await (mutations as any)[MUTATION_NAMES.LOAD_MAP_IF_NOT_LOADED](state, loadMapMutationArgs) as any;
		const branchesMapVal = branchesMap.val();
		const rootTreeId = branchesMapVal.rootTreeId;
		state.sigmaNodeLoader.loadIfNotLoaded(rootTreeId);
		/* TODO: i could see how if a map was created via branchesMapUtils
		that it would mark as not loaded inside of branchesMapLoader.loadIfNotLoaded */
	},
	[MUTATION_NAMES.EDIT_FLASHCARD](state: IState, {contentId, question, answer}: IEditFlashcardMutationArgs) {
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
		state.globalDataStore.addMutation(editAnswerMutation);
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
		state.globalDataStore.addMutation(editCategoryMutation);
	},
	[MUTATION_NAMES.PAUSE](state: IState) {
		state.interactionMode = INTERACTION_MODES.PAUSED
		state.sigmaNodesUpdater.unHighlightNode(state.currentHighlightedNodeId)
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.REFRESH)
	},
	[MUTATION_NAMES.PLAY_TREE](state: IState, {treeId}: IPlayTreeMutationArgs) {
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD)
		const flashcardTreeFactory = new FlashcardTreeFactory({store})
		const userId = state.userId
		const flashcardTree = flashcardTreeFactory.createFlashcardTree({
			treeId,
			userId
		})
		const heap = new Heap((flashcardData1: IFlashcardTreeData, flashcardData2: IFlashcardTreeData) => {
			const nextReviewTime1: timestamp =
				FlashcardTreeUtils.getNextTimeToStudy(flashcardData1)
			const nextReviewTime2: timestamp =
				FlashcardTreeUtils.getNextTimeToStudy(flashcardData2)
			return nextReviewTime1 - nextReviewTime2;
			/* ^^^ ones with the lowest next review times
			 (e.g. the cards that are most overdue) are at the top of the heap */
		})
		for (const flashcardData of Array.from(flashcardTree) as IFlashcardTreeData[]) {
			if (flashcardData.content.type.val() !== CONTENT_TYPES.FLASHCARD) {
				/*
						e.g. we don't want Categories to be included in the review heap.
						 We only want leaf nodes to be included.
						 Right now the only contentType allowed on a leaf node is FLASHCARD
				 */
				continue;
			}
			heap.push(flashcardData);
			console.log('heap item pushed', flashcardData)
		}
		state.interactionMode = INTERACTION_MODES.PLAYING;
		state.currentlyPlayingCategoryId = treeId;
		state.currentStudyHeap = heap;
		store.commit(MUTATION_NAMES.JUMP_TO_AND_HIGHLIGHT_NEXT_FLASHCARD_TO_STUDY);
	},
	/**
	 * Worst case: O(n)
	 * Usual case: lower than n, because usually only one node's priority key gets updated
	 * @param {IState} state
	 */
	[MUTATION_NAMES.REHEAPIFY_STUDY_HEAP_AND_PAUSE_IF_NO_MORE_OVERDUE](state: IState) {
		const oldTop = state.currentStudyHeap.top();
		state.currentStudyHeap.heapify();
		const newTop = state.currentStudyHeap.top();
		const overdueOrNew = FlashcardTreeUtils.isOverdueOrNew(newTop);

		/* The heap is ordered in the following manner from top to bottom
				-most overdue items are at the top
				-next are new items
				-at the bottom are non overdue items

				In the currently defined manner of how the play button works,
				 we will only have the users review overdue and new items

				 so if the item is not overdue or new,
					then we pause the review mode and notify the users that no more overdue or unseen items are there
		 */

		if (!overdueOrNew) {
			const store = getters.getStore();
			store.commit(MUTATION_NAMES.PAUSE);
		}
	},
	[MUTATION_NAMES.UNHIGHLIGHT_PREVIOUSLY_HIGHLIGHTED_NODE](state: IState) {
		if (!state.currentHighlightedNodeId) {
			return
		}
		state.sigmaNodesUpdater.unHighlightNode(state.currentHighlightedNodeId)
	},
	[MUTATION_NAMES.JUMP_TO_AND_HIGHLIGHT_NEXT_FLASHCARD_TO_STUDY](state: IState) {
		console.log('JUMP TO AND HIGHLIGHT NEXT FLASHCARD TO STUDY. Current state of heap', printStateOfFlashcardTreeHeap(state.currentStudyHeap)
		)
		const flashcardToStudyTreeData: IFlashcardTreeData = state.currentStudyHeap.top()
		const treeIdToStudy = flashcardToStudyTreeData.treeId
		const store = getters.getStore()

		const jumpToMutationArgs: IJumpToMutationArgs = {treeId: treeIdToStudy}
		store.commit(MUTATION_NAMES.JUMP_TO, jumpToMutationArgs)
		const highlightFlashcardNodeArgs: IHighlightFlashcardNodeArgs = {
			nodeId: treeIdToStudy
		}
		state.currentHighlightedNodeId = treeIdToStudy
		store.commit(MUTATION_NAMES.HIGHLIGHT_FLASHCARD_NODE, highlightFlashcardNodeArgs)
		store.commit(MUTATION_NAMES.REFRESH)
	},
	[MUTATION_NAMES.HIGHLIGHT_FLASHCARD_NODE](state: IState, {nodeId}: IHighlightFlashcardNodeArgs) {
		state.sigmaNodesUpdater.highlightNode(nodeId)
	},
	[MUTATION_NAMES.CREATE_TREE](state: IState, {parentId, contentId, children = []}: ICreateTreeMutationArgs): id {
		const createMutation: ICreateMutation<ITreeDataWithoutId> = {
			objectType: GlobalStoreObjectTypes.TREE,
			type: STORE_MUTATION_TYPES.CREATE_ITEM,
			data: {
				parentId,
				contentId,
				children
			},
		};
		const treeId = state.globalDataStore.addMutation(createMutation);
		return treeId;
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
		return treeLocationData;
	},
	[MUTATION_NAMES.MOVE_TREE_COORDINATE](state: IState, {treeId, point}: IMoveTreeCoordinateMutationArgs) {
		const currentPoint = state.globalDataStoreData.treeLocations[treeId].point
		const pointDelta = {
			x: point.x - currentPoint.x,
			y: point.y - currentPoint.y
		}
		log('moveTreeCoordinate delta is ', pointDelta)
		if (pointDelta.x < .1 && pointDelta.y < .1) {
			return
		}

		const moveTreeCoordinateByDeltaArgs: IMoveTreeCoordinateByDeltaMutationArgs = {
			treeId,
			pointDelta,
		}
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.MOVE_TREE_COORDINATE_AND_CHILDREN_BY_DELTA, moveTreeCoordinateByDeltaArgs)

	},
	[MUTATION_NAMES.MOVE_TREE_COORDINATE_AND_CHILDREN_BY_DELTA](state: IState, {treeId, pointDelta}: IMoveTreeCoordinateByDeltaMutationArgs) {
		// verify that the tree location data is loaded first before trying to alter it
		if (!state.globalDataStoreData.treeLocations[treeId] || !state.globalDataStoreData.trees[treeId]) {
			return
		}
		const oldTreePoint = state.globalDataStoreData.treeLocations[treeId].point
		const newPoint = {
			x: oldTreePoint.x + pointDelta.x,
			y: oldTreePoint.y + pointDelta.y
		}
		const mutation: ITypeIdProppedDatedMutation<PointMutationTypes> = {
			objectType: GlobalStoreObjectTypes.TREE_LOCATION,
			id: treeId,
			timestamp: Date.now(),
			type: PointMutationTypes.SET,
			propertyName: TreeLocationPropertyNames.POINT,
			data: {point: newPoint},
		};

		state.globalDataStore.addMutation(mutation);

		const store = getters.getStore()
		const children = state.globalDataStoreData.trees[treeId].children
		children.forEach(childId => {
			const moveTreeCoordinateByDeltaArgs: IMoveTreeCoordinateByDeltaMutationArgs = {
				treeId: childId,
				pointDelta,
			}
			store.commit(MUTATION_NAMES.MOVE_TREE_COORDINATE_AND_CHILDREN_BY_DELTA, moveTreeCoordinateByDeltaArgs)
		})

		// console.log("THE CHILDREN ABOUT TO BE MOVED AS WELL ARE ", children, children.toString())

	},
	[MUTATION_NAMES.ADD_NODE](state: IState, {node}: IAddNodeMutationArgs) {
		if (state.sigmaInitialized) {
			state.graph.addNode(node);
			(mutations as any)[MUTATION_NAMES.REFRESH](state, null); // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
		} else {
			state.graphData.nodes.push(node);
		}
	},
	[MUTATION_NAMES.ADD_EDGES](state: IState, {edges}: IAddEdgeMutationArgs) {
		if (state.sigmaInitialized) {
			for (const edge of edges) {
				state.graph.addEdge(edge);
			}
			(mutations as any)[MUTATION_NAMES.REFRESH](state, null); // TODO: WHY IS THIS LINE EXPECTING A SECOND ARGUMENT?
		} else {
			state.graphData.edges.push(...edges);
		}
	},
	async [MUTATION_NAMES.LOGIN](state: IState, {userId}) {
	},
	async [MUTATION_NAMES.LOGOUT](state: IState) {
		try {
			await firebase.auth().signOut()
			state.userId = null // some getters and computed properties listen to this
		} catch (e) {
			console.error('could not log out', e)
		}
	},
	async [MUTATION_NAMES.CREATE_USER_OR_LOGIN](state: IState, {userId, userInfo}: ICreateUserOrLoginMutationArgs) {
		if (!userId) {
			throw new RangeError('UserId cannot be blank');
		}
		if (state.userId) {
			throw new Error('Can\'t log user with id of ' + userId
				+ ' in!. There is already a user logged in with id of ' + state.userId);
		}
		console.log('CREATE_USER_OR_LOGIN called with ', userId, userInfo)
		const store = getters.getStore();
		const userExistsInDB = await state.userUtils.userExistsInDB(userId);
		let user: ISyncableMutableSubscribableUser;
		if (!userExistsInDB) {
			user = await state.userUtils.createUserInDB({
				userId,
				userInfo
			});
		} else {
			user = await state.userLoader.downloadUser(userId);
		}
		storeUserInStateAndSubscribe({
			user,
			userId,
			state
		});
		const setUserIdMutationArgs: ISetUserIdMutationArgs = {
			userId
		};
		store.commit(MUTATION_NAMES.SET_USER_ID, setUserIdMutationArgs);

		const saveUserInfoFromLoginProvider: ISaveUserInfoFromLoginProviderMutationArgs = {
			userId,
			userInfo,
		};
		console.log('about to call SAVE_USER_INFO_FROM_LOGIN_PROVIDER')
		store.commit(MUTATION_NAMES.SAVE_USER_INFO_FROM_LOGIN_PROVIDER, saveUserInfoFromLoginProvider);

		/* TODO: we should really be passing these user mutations through the
		globalDataStore mutation funnel . .. or maybe not . .. idk yet
		 */
		const createPrimaryUserMapIfNotCreatedArgs: ICreatePrimaryUserMapIfNotCreatedMutationArgs = {
			userData: user.val(),
			user,
		};
		store.commit(MUTATION_NAMES.CREATE_PRIMARY_USER_MAP_IF_NOT_CREATED, createPrimaryUserMapIfNotCreatedArgs);
		// TODO: once we have firebase priveleges, we may not be able to check if the user exists or not

	},
	[MUTATION_NAMES.SET_USER_DATA](state: IState, {userId, userData}: ISetUserDataMutationArgs) {
		Vue.set(state.usersData, userId, userData);
		Vue.set(state, 'usersDataHashmapUpdated', Math.random());
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
		store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs);
		// this will trigger the
	},
	[MUTATION_NAMES.LOGIN_WITH_FACEBOOK](state: IState) {
		const provider = new firebase.auth.FacebookAuthProvider();
		provider.setCustomParameters({
			//     redirect_uri: window.location.protocol + '//' + window.location.hostname
			display: 'touch'
		});
		const store: Store<any> = getters.getStore();
		// firebase.auth().signInWithRedirect(provider).then((result: {user}) => {
		// 	const userInfo: firebase.UserInfo = result.user;
		// 	const userId = userInfo.uid;
		// 	const createUserOrLoginMutationArgs: ICreateUserOrLoginMutationArgs = {
		// 		userId,
		// 		userInfo,
		// 	};
		// 	store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, createUserOrLoginMutationArgs);
		//
		// }).catch((errorObj) => {
		// 	// Handle Errors here.
		// 	const errorCode = errorObj.code;
		// 	const errorMessage = errorObj.message;
		// 	// The email of the user's account used.
		// 	const email = errorObj.email;
		// 	// The firebase.auth.AuthCredential type that was used.
		// 	const credential = errorObj.credential;
		// 	error('There was an error ', errorCode, errorMessage, email, credential);
		// });

	},
	[MUTATION_NAMES.LOGIN_WITH_EMAIL](state: IState, {email, password}: ILoginWithEmailMutationArgs) {
		const store: Store<any> = getters.getStore();
		console.log('LOGIN WITH EMAIL MUTATION CALLED', email, password)
		firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
			console.log('signInWithEmailAndPassword - firebase signin', result)
			const userId = result.user.uid;
			const userInfo = getUserInfoFromEmailLoginResult(result)
			const createUserOrLoginMutationArgs: ICreateUserOrLoginMutationArgs = {
				userId,
				userInfo,
			};
			store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, createUserOrLoginMutationArgs);

		}).catch(function emailLoginError(errorObj: any) {
			console.log('emailLoginError', email, password)
			// Handle Errors here.
			// const errorCode = error.code;
			// const errorMessage = error.messageReviewNotification;
			// // The email of the user's account used.
			// const email = error.email;
			// // The firebase.auth.AuthCredential type that was used.
			// const credential = error.credential;
			state.loginWithEmailErrorMessage = errorObj.message
			error('There was an error ', errorObj /* errorCode, errorMessage, email, credential*/);
		});

	},
	[MUTATION_NAMES.CREATE_USER_WITH_EMAIL](state: IState, {email, password}: ICreateUserWithEmailMutationArgs) {
		const store: Store<any> = getters.getStore();
		console.log('CREATE_USER_WITH_EMAIL MUTATION CALLED', email, password)
		firebase.auth().createUserWithEmailAndPassword(email, password).then((result /*: not same response type as loginW/Facebook */) => {
			console.log('CREATE USER WITH EMAIL WITH EMAIL MUTATION CALLED - callback. result is', result)
			const userInfo = getUserInfoFromEmailLoginResult(result)
			const userId = userInfo.uid;
			const createUserOrLoginMutationArgs: ICreateUserOrLoginMutationArgs = {
				userId,
				userInfo,
			};
			console.log('CREATE_USER_OR_LOGIN MUTATION about to be called with ', createUserOrLoginMutationArgs)
			store.commit(MUTATION_NAMES.CREATE_USER_OR_LOGIN, createUserOrLoginMutationArgs);

		}).catch(function emailCreateError(errorObj: any) {
			console.log('CREATE WITH EMAIL MUTATION CALLED - firebase create error', email, password)
			// Handle Errors here.
			// const errorCode = error.code;
			// const errorMessage = error.messageReviewNotification;
			// // The email of the user's account used.
			// const email = error.email;
			// // The firebase.auth.AuthCredential type that was used.
			// const credential = error.credential;
			state.signUpWithEmailErrorMessage = errorObj.message
			error('There was an error ', errorObj /* errorCode, errorMessage, email, credential*/);
		});

	},
	[MUTATION_NAMES.SAVE_USER_INFO_FROM_LOGIN_PROVIDER](state: IState,
																											{userId, userInfo}: ISaveUserInfoFromLoginProviderMutationArgs) {
		console.log('SAVE_USER_INFO_FROM_LOGIN_PROVIDER', 'userInfo is ', userInfo)
		const user = state.users[userId];
		const mutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames> = {
			propertyName: UserPropertyNames.USER_INFO,
			timestamp: Date.now(),
			type: FieldMutationTypes.SET,
			data: userInfo
		};
		user.addMutation(mutation);
		console.log('user mutation just added in SAVE_USER_INFO_FROM_LOGIN_PROVIDER')
	},
	// TODO: we also need a mutation called SET_MAP_ID_AND_ZOOM_TO_ROOT_TREE_ID
	[MUTATION_NAMES.SWITCH_TO_LAST_USED_MAP](state: IState) {
		// const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
		// 	branchesMapId: GLOBAL_MAP_ID // hardcode last used map as GLOBAL_MAP_ID for now
		// };
		const store = getters.getStore();
		// store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapMutationArgs);
		store.commit(MUTATION_NAMES.SWITCH_TO_PERSONAL_MAP)
	},
	[MUTATION_NAMES.SWITCH_TO_GLOBAL_MAP](state: IState) {
		const store = getters.getStore();
		const switchToMapArgs: ISwitchToMapMutationArgs = {
			branchesMapId: GLOBAL_MAP_ID
		};
		store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapArgs);
		// TODO: more specifically switch to the submap they were on on the global map?
	},
	[MUTATION_NAMES.SWITCH_TO_PERSONAL_MAP](state: IState) {
		const store = getters.getStore();
		const userData: IUserData = state.usersData[state.userId];
		const personalMapId = userData.rootMapId;
		const switchToMapArgs: ISwitchToMapMutationArgs = {
			branchesMapId: personalMapId
		};
		store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapArgs);
		// TODO: more specifically switch to the submap they were on on the personal map?
	},
	[MUTATION_NAMES.SWITCH_TO_MAP](state: IState, {branchesMapId}: ISwitchToMapMutationArgs) {
		const store = getters.getStore();

		const loadMapMutationArgs: ILoadMapAndRootSigmaNodeMutationArgs = {
			branchesMapId
		};

		store.commit(MUTATION_NAMES.LOAD_MAP_AND_ROOT_SIGMA_NODE, loadMapMutationArgs);
		// MUTATION_NAMES.ZOOM_TO_LAST_LOCATION_USER_WAS_AT_ON_THE_MAP
		store.commit(MUTATION_NAMES.SET_MAP_ID, loadMapMutationArgs);
		store.commit(MUTATION_NAMES.REFRESH);
	},
	[MUTATION_NAMES.SET_MAP_ID](state: IState, {branchesMapId}: ISetBranchesMapIdMutationArgs) {
		if (!state.sigmaInitialized) {
			throw new Error('Cannot set map id before sigma has been initialized.' +
				' because the renderer we are trying to set the mapIdOn is null');
		}
		state.currentMapId = branchesMapId;
		state.renderer.mapIdToRender = branchesMapId; // TODO: fix pathological coupling with the sigma renderer class
	},
	[MUTATION_NAMES.SET_TREE_DATA](state: IState, {treeId, treeDataWithoutId}: ISetTreeDataMutationArgs) {
		Vue.set(this.state.globalDataStoreData.trees, treeId, treeDataWithoutId);
	},
	[MUTATION_NAMES.SET_TREE_LOCATION_DATA](state: IState,
																					{treeId, treeLocationData}: ISetTreeLocationDataMutationArgs) {
		Vue.set(this.state.globalDataStoreData.treeLocations, treeId, treeLocationData);
	},
	[MUTATION_NAMES.SET_TREE_USER_DATA](state: IState, {treeId, treeUserData}: ISetTreeUserDataMutationArgs) {
		Vue.set(this.state.globalDataStoreData.treeUsers, treeId, treeUserData);
	},
	[MUTATION_NAMES.SET_CONTENT_DATA](state: IState, {contentId, contentData}: ISetContentDataMutationArgs) {
		Vue.set(this.state.globalDataStoreData.content, contentId, contentData);
	},
	[MUTATION_NAMES.SET_CONTENT_USER_DATA](state: IState,
																				 {contentUserId, contentUserData}: ISetContentUserDataMutationArgs) {
		Vue.set(this.state.globalDataStoreData.contentUsers, contentUserId, contentUserData);
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
		store.commit(MUTATION_NAMES.SET_TREE_USER_DATA, setTreeUserDataMutationArgs)
	},
	[MUTATION_NAMES.SET_CONTENT](state: IState, {contentId, content}: ISetContentMutationArgs) {
		Vue.set(this.state.globalDataStoreObjects.content, contentId, content)
		const setContentDataMutationArgs: ISetContentDataMutationArgs = {
			contentId,
			contentData: content.val(),
		}
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.SET_CONTENT_DATA, setContentDataMutationArgs)
	},
	[MUTATION_NAMES.SET_CONTENT_USER](state: IState,
																		{contentUserId, contentUser}: ISetContentUserMutationArgs) {
		Vue.set(this.state.globalDataStoreObjects.contentUsers, contentUserId, contentUser)
		const setContentUserDataMutationArgs: ISetContentUserDataMutationArgs = {
			contentUserId,
			contentUserData: contentUser.val(),
		}
		const store = getters.getStore()
		store.commit(MUTATION_NAMES.SET_CONTENT_USER_DATA, setContentUserDataMutationArgs)
	},
};
const actions = {};

let initialized = false;
@injectable()
export default class BranchesStore {
	constructor(@inject(TYPES.BranchesStoreArgs){
		globalDataStore,
		state,
		contentIdSigmaIdsMap,
		sigmaNodeLoader,
		sigmaNodeLoaderCore,
		branchesMapLoader,
		branchesMapUtils,
		userLoader,
		userUtils,
		sigmaFactory,
		sigmaNodesUpdater,
		sigmaEdgesUpdater,
		mapStateManager,
	}: BranchesStoreArgs) {
		if (initialized) {
			return {} as Store<any>;
			// DON"T let the store singleton be messed up
		}
		const stateArg: IState = {
			...state,
			contentIdSigmaIdsMap,
			globalDataStore,
			sigmaNodeLoader,
			sigmaNodesUpdater,
			sigmaEdgesUpdater,
			sigmaNodeLoaderCore,
			branchesMapLoader,
			branchesMapUtils,
			userLoader,
			userUtils,
			sigmaFactory,
			mapStateManager,
		};
		Vue.use(Vuex);
		const store = new Store({
			state: stateArg,
			mutations,
			actions,
			getters,
		}) as Store<any>;
		getters.getStore = () => store;
		(window as any).store = store // for debugging purposes only
		sigmaNodesUpdater.getStore = getters.getStore //TODO: fix this pathological coupling
		sigmaEdgesUpdater.getStore = getters.getStore //TODO: fix this pathological coupling
		store['branchesMapLoader'] = branchesMapLoader;
		store['branchesMapUtils'] = branchesMapUtils;
		store['globalDataStore'] = globalDataStore; // added just to pass injectionWorks test
		store['mapStateManager'] = mapStateManager; // added just to pass injectionWorks test
		store['sigmaFactory'] = sigmaFactory; // added just to pass injectionWorks test
		store['sigmaNodesUpdater'] = sigmaNodesUpdater; // added just to pass injectionWorks test
		store['sigmaEdgesUpdater'] = sigmaEdgesUpdater; // added just to pass injectionWorks test
		store['sigmaNodeLoader'] = sigmaNodeLoader; // added just to pass injectionWorks test
		store['sigmaNodeLoaderCore'] = sigmaNodeLoaderCore; // added just to pass injectionWorks test
		store['userUtils'] = userUtils; // added just to pass injectionWorks test
		store['userLoader'] = userLoader; // added just to pass injectionWorks test
		store['_id'] = Math.random();
		initialized = true;
		return store;
	}
}

@injectable()
export class BranchesStoreArgs {
	@inject(TYPES.IMutableSubscribableGlobalStore) public globalDataStore;
	@inject(TYPES.IUserLoader)
	@tagged(TAGS.AUTO_SAVER, true) public userLoader: IUserLoader;
	@inject(TYPES.IOneToManyMap)
	@tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
	public contentIdSigmaIdsMap: IOneToManyMap<id>;
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
	@inject(TYPES.IUserUtils) public userUtils: IUserUtils;
	@inject(TYPES.ISigmaNodesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesUpdater;
	@inject(TYPES.ISigmaEdgesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaEdgesUpdater;
	@inject(TYPES.IMapStateManager)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public mapStateManager: IMapStateManager;
}

function storeUserInStateAndSubscribe(
	{user, state, userId}: { user: ISyncableMutableSubscribableUser, state: IState, userId: id }) {

	const store = getters.getStore();
	user.onUpdate((userVal: IUserData) => {
		const mutationArgs: ISetUserDataMutationArgs = {
			userData: userVal,
			userId,
		};
		store.commit(MUTATION_NAMES.SET_USER_DATA, mutationArgs);
	});
	user.startPublishing();
	state.users[userId] = user;
	state.usersData[userId] = user.val();
}

function storeBranchesMapInStateAndSubscribe(
	{state, branchesMapId, branchesMap}:
		{ state: IState, branchesMap: ISyncableMutableSubscribableBranchesMap, branchesMapId: id }) {

	const store = getters.getStore();
	branchesMap.onUpdate((branchesMapVal: IBranchesMapData) => {
		const mutationArgs: ISetBranchesMapDataMutationArgs = {
			branchesMapData: branchesMapVal,
			branchesMapId,
		};
		store.commit(MUTATION_NAMES.SET_BRANCHES_MAP_DATA, mutationArgs);
	});
	branchesMap.startPublishing();
	state.branchesMaps[branchesMapId] = branchesMap;
	state.branchesMapsData[branchesMapId] = branchesMap.val();
}
