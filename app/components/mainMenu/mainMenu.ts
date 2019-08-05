import {TYPES} from '../../objects/types';
import {
	inject,
	injectable, tagged
} from 'inversify';
import {
	ICardMainCreator,
	IMainMenuCreator,
	IMapStateManager
} from '../../objects/interfaces';
import {
	mapState,
	Store
} from 'vuex';
import {CardMainCreatorArgs} from '../cardMain/cardMain';
import {TAGS} from '../../objects/tags';

const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
	let register = require('ignore-styles').default;
	if (!register) {
		register = require('ignore-styles');
	}
	register(['.html']);
} else {
	template = require('./mainMenu.html').default;
	require('./mainMenu.less');
}
const UPDATE_FONT_SIZE = 25
const REGULAR_FONT_SIZE = 20
// tslint:disable-next-line no-var-requires

@injectable()
export class MainMenuCreator implements IMainMenuCreator {
	private store: Store<any>;
	private mapStateManager: IMapStateManager;

	/* TODO: Each of these loaders should have baked into them certain auth cookies
	 that determine whether or not they are actually permitted to load the data
		*/

	// TODO: will this constructor need userId as an arg?
	constructor(@inject(TYPES.MainMenuCreatorArgs){
		/*userId,*/ store, mapStateManager
	}: MainMenuCreatorArgs) {
		this.store = store;
		this.mapStateManager = mapStateManager;
	}

	public create() {
		const me = this;
		const component = {
			template,
			props: {
			},
			mounted() {
			},
			data() {
				return {
					menuOpen: false
				}
			},
			computed: {
			},
			methods: {
				toggleOpen() {
					console.log('toggleOpen called')
					if (this.menuOpen) {
						this.close()
					} else {
						this.open()
					}
				},
				logout(e) {
					console.log('logout called')
					e.stopPropagation();
				},
				clickAway(e) {
					console.log('click away called')
					this.close()
				},
				doNothing(e) {
					e.stopPropagation()
				},
				open() {
					me.mapStateManager.enterDarkMode()
					this.menuOpen = true;
				},
				close() {
					me.mapStateManager.enterMainMode()
					this.menuOpen = false;
				}
			}
		};
		return component;
		// return {} as Component
	}
}

@injectable()
export class MainMenuCreatorArgs {
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	@inject(TYPES.IMapStateManager) public mapStateManager: IMapStateManager;
}
