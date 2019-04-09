import {TAGS} from '../../objects/tags';

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./node-hover-icons.less').default || require('./node-hover-icons.less');
	template = require('./node-hover-icons.html').default || require('./node-hover-icons.html');
}

import {
	inject,
	injectable, tagged
} from 'inversify';
import 'reflect-metadata';
import {Store} from 'vuex';
import {
	IStoreGetters,
	ITooltipOpener,
	ITreeDataWithoutId,
	ITreeLocationData,
	IVueComponentCreator,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {calculateCardHeight} from '../../../other_imports/sigma/renderers/canvas/getRectangleCorners';
// tslint:disable-next-line no-var-requires

// import {Store} from 'vuex';
@injectable()
export class NodeHoverIconsCreator implements IVueComponentCreator {
	private store: Store<any>;
	private tooltipOpener: ITooltipOpener;
	// private userId: string

	/* TODO: Each of these loaders should have baked into them certain auth cookies
	 that determine whether or not they are actually permitted to load the data
		*/

	// TODO: will this constructor need userId as an arg?
	constructor(@inject(TYPES.NodeHoverIconsCreatorArgs){
		/*userId,*/ store,
		tooltipOpener,
	}: NodeHoverIconsCreatorArgs) {
		this.store = store;
		this.tooltipOpener = tooltipOpener
	}

	public create() {
		const me = this;
		const component = {
			template,
			props: {
				id: String,
				parentId: String,
				contentUserId: String,
				contentId: String,
				userId: String,
				nodeSize: Number,
			},
			beforeMount() {
				// console.log('are refs available before Mount???', this.$refs)
				// this.$refs.iconsContainer.style.top = '100px;';
			},
			mounted() {
				const height = calculateCardHeight(null, this.nodeSize);
				const halfCardHeight = height / 2
				const halfIconHeight = 25
				const iconOffset = halfCardHeight + halfIconHeight;
				console.log('are refs available before Mount???', this.$refs, this.nodeSize, iconOffset)
				// this.$refs.iconsContainer.style.top = iconOffset + 'px;';
				;(window as any).iconsContainer = this.$refs.iconsContainer;
			},
			data() {
				return {};
			},
			computed: {
				canMakeChildren() {
					return this.$store.getters.treeContentIsCategory(this.id)
				},
				treeData() {
					const treeData: ITreeDataWithoutId = me.store.getters.contentData(this.id) || {};
					return treeData;
				},
				treeLocationData() {
					const treeLocationData: ITreeLocationData = me.store.getters.treeLocationData(this.id) || {};
					return treeLocationData;
				},
				x(): string {
					const x = this.treeLocationData.point && this.treeLocationData.point.x;
					return x;
				},
				y(): string {
					const y = this.treeLocationData.point && this.treeLocationData.point.y;
					return y;
				},
			},
			methods: {
				openEdit() {
					const sigmaNode = me.store.getters.sigmaNode(this.id)
					me.tooltipOpener.openEditTooltip(sigmaNode)
				},
				openAdd() {
					const sigmaNode = me.store.getters.sigmaNode(this.id)
					me.tooltipOpener.openAddTooltip(sigmaNode)
				},
				play() {
					// TODO:
				}
				// unnecessary now that tree chain is composed of categories/categorys whose nodes dont have one color
				// global methods
			}
		};
		return component;
		// return {} as Component
	}
}

@injectable()
export class NodeHoverIconsCreatorArgs {
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.ITooltipOpener) public tooltipOpener: ITooltipOpener;
}
