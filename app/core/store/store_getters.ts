import {
	GetterTree,
	Store
} from 'vuex';
import {
	CONTENT_TYPES,
	decibels,
	IContentData,
	IContentUserData,
	id,
	ISigmaGraph,
	ISigmaNode,
	IState,
	IStoreGetters,
	ITreeDataWithoutId,
	ITreeLocationData,
	ITreeUserData,
	IUserData
} from '../../objects/interfaces';
import {log} from '../log';
import {INTERACTION_MODES} from './interactionModes';

export const getters: GetterTree<IState, IState> & IStoreGetters = {
	getStore(): Store<any> {
		return {} as Store<any>;
	}, // Getter Will get redefined later during store constructor
	sigmaGraph(state: IState, getters): ISigmaGraph {
		log('getters sigmaGraph called');
		if (!state.sigmaInitialized) {
			throw new Error('Cant access sigmaGraph yet. Sigma not yet initialized');
		}
		return state.sigmaInstance.graph;
	},
	sigmaNode(state, getters) {
		return (id: id): ISigmaNode => {
			const graph: ISigmaGraph = getters.sigmaGraph
			return graph.nodes(id)
		}
		// const graph = getters.sigmaGraph(state,)

	},
	sampleGetter() {
		return num => num * 5;
	},
	sampleAsyncGetter() {
		return num => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(num * 5)
				}, 1000)
			});
		};
	},
	userId(state: IState, getters): id {
		return state.userId;
	},
	userData(state: IState, getters) {
		return (userId: id): IUserData => {
			let reactive = state.usersDataHashmapUpdated;
			let obj = {
				reactive: state.usersDataHashmapUpdated,
				...state.usersData[userId]
			};
			return obj;
		}
	},
	currentUserName(state: IState, getters) {
		const userId = getters.userId;
		const userData: IUserData = getters.userData(userId)
		const {userInfo} = userData
		return userInfo.displayName || userInfo.email || 'Unknown User'
	},
	email(state: IState, getters) {
		const userId = getters.userId;
		const userData: IUserData = getters.userData(userId)
		return userData && userData.userInfo && userData.userInfo.email || ''
	},
	userPoints(state: IState, getters) {
		return (userId: id): number => {
			const userData = getters.userData(userId);
			if (!userData) {
				return 0
			}
			return userData.points;
		}
	},
	contentUserLastEstimatedStrength(state: IState, getters) {
		return (contentUserId: id): decibels => {
			const contentUserData = state.globalDataStoreData.contentUsers[contentUserId];
			if (!contentUserData) {
				return 0
			}
			const lastEstimatedStrength: decibels = contentUserData.lastEstimatedStrength;
			return lastEstimatedStrength;
		}
	},
	loggedIn(state: IState, getters): boolean {
		const loggedIn = !!state.userId;
		return loggedIn
	},
	hasAccess(state: IState, getters): Promise<boolean> {
		// return false
		return getters.userHasAccess(state.userId)
	},
	userHasAccess(state: IState, getters) {
		return (userId: id): boolean => {
			const userData: IUserData = getters.userData(userId);
			if (!userData) {
				return false;
			} else {
				return userData.membershipExpirationDate >= Date.now();
			}
		}
	},
	treeContentIsCategory(state: IState, gettersa) {
		const gettersAny: any = gettersa
		return (treeId: id): boolean => {
			const treeData: ITreeDataWithoutId = gettersAny.treeData(treeId)
			const contentData: IContentData = gettersAny.contentData(treeData.contentId)
			return contentData.type === CONTENT_TYPES.CATEGORY
		}

	},
	treeData(state: IState, getters) {
		return (treeId: id): ITreeDataWithoutId => state.globalDataStoreData.trees[treeId];
	},
	treeLocationData(state: IState, getters) {
		return (treeId: id): ITreeLocationData => state.globalDataStoreData.treeLocations[treeId];
	},
	treeUserData(state: IState, getters) {
		return (treeUserId: id): ITreeUserData => state.globalDataStoreData.treeUsers[treeUserId];
	},
	contentData(state: IState, getters) {
		return (contentId: id): IContentData => state.globalDataStoreData.content[contentId];
	},
	contentUserData(state: IState, getters) {
		return (contentUserId: id): IContentUserData => state.globalDataStoreData.contentUsers[contentUserId];
	},
	playing(state: IState, getters) {
		return state.interactionMode === INTERACTION_MODES.PLAYING;
	}
};
