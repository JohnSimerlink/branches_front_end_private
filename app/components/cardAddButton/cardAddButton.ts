// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	CONTENT_TYPES,
	IEditCardTitleLocallyMutationArgs,
	ISigmaNodeData,
	IState,
	ITreeLocationData,
} from '../../objects/interfaces';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import './cardAddButton.less';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {
	calcHeight,
	calculateTextSizeFromNodeSize
} from '../../../other_imports/sigma/renderers/canvas/getDimensions';
import {MAP_STATES} from '../../objects/mapStateManager/MAP_STATES';
import {INewChildTreeMutationArgs} from '../../core/store/store_interfaces';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardAddButton.html').default;

export default {
	template,
	props: {
	},
	beforeCreate() {
		console.log('cardAddButton beforeCreate')
	},
	created() {
		console.log('cardAddButton beforeCreate')
	},
	beforeMount() {
		console.log('cardAddButton beforeMount')
	},
	mounted() {
		console.log('cardAddButton mounted')
		if (this.node) {
			this.$refs.title.focus()
		}









	},
	beforeUpdate() {
		console.log('cardAddButton beforeUpdate')

	},
	updated() {
		console.log('cardAddButton updated')
	},
	beforeDestroy() {
		console.log('cardAddButton beforeDestroy')
	},
	destroyed() {
		console.log('cardAddButton destroyed')
	},
	data() {
		return {
		};
	},
	watch: {
	},
	computed: {
		location(): ITreeLocationData {
			const loc =  this.$store.getters.treeLocationData(this.hoveringCardId);
			console.log('parent location data is ', loc)
			return loc
			// return loc
		},
		hoveringCardId() {
			return this.$store.hoveringCardId
		},
		top() {
			if (this.node) {
				const top = this.node['renderer1:y'] - this.cardHeight / 2
				return top
			}
		},
		bottom() {
			if (this.node) {
				const bottom = this.node['renderer1:y'] + this.cardHeight / 2
				return bottom
			}
		},
		cardCenter() {
			if (this.node) {
				return this.node['renderer1:x']
			}
		},
		left() {
			if (this.node) {
				const left = this.node['renderer1:x'] - this.cardWidth / 2
				return left
			}
			// this.node()
		},
		node(): ISigmaNodeData {
			if (!this.$store) {
				return
			}
			const state: IState = this.$store.state
			if (state.sigmaInitialized && state.hoveringCardId) {
				return state.graph.nodes(state.hoveringCardId)
			}
		},
		contentTitle() {
			if (this.node) {
				// console.log('content title is ', this.node.content.title, this.$refs.title.value)
				return this.node.content.title
			}
		},
		contentType() {
			if (this.node) {
				return this.node.content.type
			}
		},
		proficiency() {
			if (this.node) {
				return this.node.contentUserData && this.node.contentUserData.proficiency || PROFICIENCIES.UNKNOWN
			}
		},
		// content(): IContentData {
		// 	const contentData = this.$store.getters.contentData(this.contentId) || {};
		// 	return contentData;
		// },
		nodeColor() {
			const proficiency = Number.parseInt(this.proficiency)
			const color = ProficiencyUtils.getColorFromMapState(proficiency, MAP_STATES.MAIN)
			return color

		},
		renderedSize() {
			if (this.node) {
				return this.node['renderer1:size']
			}
		},
		cardWidth() {
			if (this.node) {
				const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
				console.log('cardEdit cardWidth called', this.renderedSize, width)
				return width
			}
		},
		cardHeight() {
			if (!this.node) {
				return
			}
			const height = calcHeight(this.node)
			console.log('cardEdit cardHeight called', this.renderedSize, height)
			return height
		},
		fontSize() {
			const size = calculateTextSizeFromNodeSize(this.renderedSize)
			return size
		},
		typeIsCategory() {
			return this.contentType === CONTENT_TYPES.CATEGORY;
		},
		typeIsFlashcard() {
			return this.contentType === CONTENT_TYPES.FLASHCARD;
		},
		typeIsSkill() {
			return this.contentType === CONTENT_TYPES.SKILL;
		},
		typeIsMap() {
			return this.contentType === CONTENT_TYPES.MAP;
		},
	},
	methods: {
		createNewCard() {
			const parentTreeLocationData: ITreeLocationData = {
				point: {
					x: this.node.x,
					y: this.node.y,
				},
				level: this.node.level,
				mapId: this.node.mapId,
			}
			const newChildTreeMutationArgs: INewChildTreeMutationArgs = {
				parentTreeId: this.hoveringCardId,
				timestamp: Date.now(),
				contentType: CONTENT_TYPES.CATEGORY,
				question: '',
				answer: '',
				title: 'This is an example new card',
				parentLocation: this.location,
			}
			this.$store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeMutationArgs);
		},
		keypressed() {
			this.resize();
			this.changeContent();

		},
		resize() {
			console.log('this.resize called height:', this.$refs.title.style.height)
			console.log('this.resize called scrollHeight:', this.$refs.title.scrollHeight)
			this.$refs.title.style.height = 'auto'
			this.$refs.title.style.height = this.$refs.title.scrollHeight + 'px'
		},
		// global methods
		changeContent() {
			// console.log("cardEdit changeContent called");
			switch (this.contentType) {
				// case CONTENT_TYPES.FLASHCARD:
				// 	const editFactMutation: IEditFactMutationArgs = {
				// 		contentId: this.contentId,
				// 		question: this.$refs.question.value,
				// 		answer: this.$refs.answer.value,
				// 	};
				// 	// console.log("cardEdit changeContent flashcard called", editFactMutation);
				// 	this.$store.commit(MUTATION_NAMES.EDIT_FACT, editFactMutation);
				// 	this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
				// 	break;
				case CONTENT_TYPES.CATEGORY:
					const editCardTitleLocallyMutation: IEditCardTitleLocallyMutationArgs = {
						title: this.$refs.title.value,
					};
					this.$store.commit(MUTATION_NAMES.EDIT_CARD_TITLE_LOCALLY, editCardTitleLocallyMutation);
					// const editCategoryMutation: IEditCategoryMutationArgs = {
					// 	contentId: this.contentId,
					// 	title: this.$refs.title.value,
					// };
					// console.log("cardEdit changeContent category called", editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.EDIT_CATEGORY, editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					break;
			}
			this.editing = false;
		},
	}
};
