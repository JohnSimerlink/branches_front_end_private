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
} from '../../objects/interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {TYPES} from '../../objects/types';
import './map.less';

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
					return true
				},
				openCardId() {
					return me.store.state.currentOpenTreeId
				},
				openContentUserId() {
					return '123'
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
