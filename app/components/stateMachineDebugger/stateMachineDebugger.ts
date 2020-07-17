// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {
	inject,
	injectable
} from 'inversify';
import {log} from '../../core/log';
import 'reflect-metadata';
import {mapState, Store} from 'vuex';
import {
	IStateMachineDebuggerCreator,
	ISigmaNodeLoader,
	IState,
	IStoreGetters,
	ITreeData, IMapInteractionState,
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
	private mapInteractionState: IMapInteractionState;

	constructor(
		@inject(TYPES.StateMachineDebuggerCreatorArgs)
			{
				store,
				mapInteractionState,
			}: StateMachineDebuggerCreatorArgs) {
		this.store = store;
		this.mapInteractionState = mapInteractionState;
	}

	public create() {
		const me = this;
		return {
			props: ['mapId'],
			template,
			store: this.store,
			mounted() {
			},
			computed: mapState({
				hoverCardIsSomething: (state: IState) => state.hoverCardIsSomething,
				editCardIsSomething: (state: IState) => state.editCardIsSomething,
				twoCardsAreSame: (state: IState) => state.editAndHoverCardsExistAndAreSame,
				hoverCardFlipped: (state: IState) => state.hoverCardExistsAndIsFlipped,
				editCardFlipped: (state: IState) => state.editCardExistsAndIsFlipped,
				hoveringCardId: (state: IState) => state.hoveringCardId,
				editingCardId: (state: IState) => state.editingCardId,
			})
		// computed: {
		// 		hoverCardIsSomething() {
		// 			return me.store.state.hoverCardIsSomething
		// 		},
		// 		editCardIsSomething() {
		// 			return me.store.state.editCardIsSomething
		// 		},
		// 		twoCardsAreSame() {
		// 			return me.store.state.twoCardsExistAndAreSame
		// 		},
		// 		hoverCardFlipped() {
		// 			return me.store.state.hoverCardExistsAndIsFlipped
		// 		},
		// 		editCardFlipped() {
		// 			return me.store.state.editCardExistsAndIsFlipped
		// 		},
		// 		hoveringCardId() {
		// 			return me.store.state.hoveringCardId
		// 		},
		// 		editingCardId() {
		// 			return me.store.state.editingCardId
		// 		},
		// 	}
		// };
		// 	computed: {
		// 		hoverCardIsSomething() {
		// 			return me.mapInteractionState.hoverCardIsSomething
		// 		},
		// 		editCardIsSomething() {
		// 			return me.mapInteractionState.editCardIsSomething
		// 		},
		// 		twoCardsAreSame() {
		// 			return me.mapInteractionState.twoCardsExistAndAreSame
		// 		},
		// 		hoverCardFlipped() {
		// 			return me.mapInteractionState.hoverCardExistsAndIsFlipped
		// 		},
		// 		editCardFlipped() {
		// 			return me.mapInteractionState.editCardExistsAndIsFlipped
		// 		},
		// 		hoveringCardId() {
		// 			return me.mapInteractionState.hoveringCardId
		// 		},
		// 		editingCard() {
		// 			return me.mapInteractionState.editingCardId
		// 		},
		// 	}
		};

	}
}

@injectable()
export class StateMachineDebuggerCreatorArgs {
	@inject(TYPES.BranchesStore)
	public store: Store<any>;
	@inject(TYPES.IMapInteractionState)
	public mapInteractionState: IMapInteractionState;
}
