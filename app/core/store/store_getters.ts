import {Store} from 'vuex';
import {
	decibels, IContentData, IContentUserData, id, ISigmaGraph, IState, ITreeDataWithoutId, ITreeLocationData,
	ITreeUserData,
	IUserData
} from '../../objects/interfaces';
import {log} from '../log';
import {INTERACTION_MODES} from './interactionModes';

export const getters = {
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
		return (userId: id) => {
			let reactive = state.usersDataHashmapUpdated;
			let obj = {
				reactive: state.usersDataHashmapUpdated,
				...state.usersData[userId]
			};
			return obj;
		}
	},
	userPoints(state: IState, getters) {
		return (userId: id) => {
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
	async hasAccess(state: IState, getters): Promise<boolean> {
		return false
		// return await getters.userHasAccess(state.userId)
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
	treeData(state: IState, getters) {
		return (treeId: id): ITreeDataWithoutId => state.globalDataStoreData.trees[treeId];
	},
	treeLocationData(state: IState, getters) {
		return (treeId: id): ITreeLocationData => state.globalDataStoreData.treeLocations[treeId];
	},
	treeUsersData(state: IState, getters) {
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

