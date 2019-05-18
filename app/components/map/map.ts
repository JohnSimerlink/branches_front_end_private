// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {
	inject,
	injectable
} from 'inversify';
import 'reflect-metadata';
import {Store} from 'vuex';
import {
	IKnawledgeMapCreator,
	ISigmaNodeLoader,
	IState,
	IStoreGetters,
	ITreeData,
} from '../../objects/interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {TYPES} from '../../objects/types';
import './map.less';
import {getters} from '../../core/store/store_getters';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}
// tslint:disable-next-line no-var-requires
const template = require('./map.html').default;

@injectable()
export class KnawledgeMapCreator implements IKnawledgeMapCreator {
	private sigmaNodeLoader: ISigmaNodeLoader;
	private store: Store<IState>;

	constructor(
		@inject(TYPES.KnawledgeMapCreatorArgs)
			{
				sigmaNodeLoader,
				store
			}: KnawledgeMapCreatorArgs) {
		this.sigmaNodeLoader = sigmaNodeLoader;
		this.store = store;
	}

	public create() {
		const me = this;
		return {
			props: ['mapId'],
			template,
			mounted() {
				console.log('TIME loadTimeSoFar knawaledgeMap mounted', window['calculateLoadTimeSoFar'](Date.now()))
				me.store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);
				me.store.commit(MUTATION_NAMES.SWITCH_TO_LAST_USED_MAP);
			},
			computed: {
				mobileCardOpen(): boolean {
					return me.store.state.mobileCardOpen
				},
				openCardId() {
					console.log('map.ts openCardId', me.store.state.currentOpenTreeId)
					return me.store.state.currentOpenTreeId
				},
				openContentId() {
					const treeId = this.openCardId
					if (!treeId) return
					const treeData: ITreeData = me.store.getters.treeData(treeId)
					const contentId = treeData.contentId
					console.log('map.ts openContentId', this.openCardId, contentId)
					return contentId
				},
				openContentUserId() {
					const userId =  me.store.getters.userId
					const contentUserId = getContentUserId({
						contentId: this.openContentId,
						userId
					})
					return contentUserId
				}, //TODO: use the Vuex equivalent of mapStateToComputed or local Getters
			}
		};

	}
}

@injectable()
export class KnawledgeMapCreatorArgs {
	@inject(TYPES.ISigmaNodeLoader)
	public sigmaNodeLoader: ISigmaNodeLoader;
	@inject(TYPES.BranchesStore)
	public store: Store<any>;
}
