// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {
	inject,
	injectable
} from 'inversify';
import {log} from '../../core/log';
import 'reflect-metadata';
import {Store} from 'vuex';
import {
	IStateMachineDebuggerCreator,
	ISigmaNodeLoader,
	IState,
	IStoreGetters,
	ITreeData,
} from '../../objects/interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {TYPES} from '../../objects/types';
import './stateMachineDebugger.less';
import {getters} from '../../core/store/store_getters';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}
// tslint:disable-next-line no-var-requires
const template = require('./stateMachineDebugger.html').default;

@injectable()
export class StateMachineDebuggerCreator implements IStateMachineDebuggerCreator {
	private sigmaNodeLoader: ISigmaNodeLoader;
	private store: Store<IState>;

	constructor(
		@inject(TYPES.StateMachineDebuggerCreatorArgs)
			{
				store
			}: StateMachineDebuggerCreatorArgs) {
		this.store = store;
	}

	public create() {
		const me = this;
		return {
			props: ['mapId'],
			template,
			mounted() {
			},
			computed: {
				hoverCardIsSomething() {
					return !!this.hoveringCard
				},
				editCardIsSomething() {
					return !!this.editingCard
				},
				twoCardsAreSame() {
					return this.editingCard === this.hoveringCard
				},
				hoverCardFlipped() {
					if (!this.hoverCardIsSomething) {
						return 'NA'
					}
					return this.hoveringCard.flipped
				},
				editCardFlipped() {
					if (!this.editCardIsSomething) {
						return 'NA'
					}
					return this.editingCard.flipped
				},
				hoveringCard() {
					return me.store.state.hoveringCard
				},
				editingCard() {
					return me.store.state.editingCard
				},
			}
		};

	}
}

@injectable()
export class StateMachineDebuggerCreatorArgs {
	@inject(TYPES.BranchesStore)
	public store: Store<any>;
}
