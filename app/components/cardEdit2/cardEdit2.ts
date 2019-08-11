// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	CONTENT_TYPES,
	IEditCardTitleLocallyMutationArgs,
	IEditCategoryMutationArgs,
	IEditFactMutationArgs,
	ISigmaNodeData,
	IState,
} from '../../objects/interfaces';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import './cardEdit2.less';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {
	calcHeight,
	calculateTextSizeFromNodeSize
} from '../../../other_imports/sigma/renderers/canvas/getDimensions';
import {MAP_STATES} from '../../objects/mapStateManager/MAP_STATES';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardEdit2.html').default;

export default {
	template,
	props: {
	},
	beforeCreate() {
		console.log('cardEdit2 beforeCreate')
	},
	created() {
		console.log('beforeCreate')
	},
	beforeMount() {
		console.log('beforeMount')
	},
	mounted() {
		console.log('mounted')
		if (this.node) {
			this.$refs.title.focus()
		}
		// console.log(`cardEdit mounted is: contentId: ${this.contentId}, contentTitle: ${this.contentTitle} contentString: ${this.contentString}. content: ${this.content} `, this, this.content, this.content.id, this.content.question, this.content.answer, this.content.title);
		// if (this.typeIsCategory) {
		// 	this.addingChild = true;
		// }
		// setTimeout(() => {
		// 	console.log('title val is ', this.$refs.title.value)
		// },200)
		// setTimeout(() => {
		// 	console.log('title val is ', this.$refs.title.value)
		// },500)
		// setTimeout(() => {
		// 	console.log('title val is ', this.$refs.title.value)
		// },1000)
		// setTimeout(() => {
		// 	console.log('title val is ', this.$refs.title.value)
		// },1500)











	},
	beforeUpdate() {
		console.log('beforeUpdate')

	},
	updated() {
		console.log('updated')
	},
	beforeDestroy() {
		console.log('beforeDestroy')
	},
	destroyed() {
		console.log('destroyed')
	},
	data() {
		return {
		};
	},
	watch: {
		contentTitle() {
			if (this.$refs.title) {
				console.log('contentTitle just changed', this.$refs.title.value, this.$refs.title.value.trim())
				this.$refs.title.value = this.$refs.title.value.trim();
				this.resize();
			}
			setTimeout(() => {
				if (!this.$refs.title) {
					return
				}
				console.log('WAIT 100contentTitle just changed', this.$refs.title.value, this.$refs.title.value.trim())
				this.$refs.title.value = this.$refs.title.value.trim();
				this.$refs.title.focus();

			}, 50) //HACK
		}
	},
	computed: {
		top() {
			console.log('this.top called')
			if (this.node) {
				const top = this.node['renderer1:y'] - this.cardHeight / 2
				console.log('this.top called',top)
				return top
			}
		},
		left() {
			console.log('this.left called')
			if (this.node) {
				const left = this.node['renderer1:x'] - this.cardWidth / 2
				console.log('this.left called',left)
				return left
			}
			// this.node()
		},
		node(): ISigmaNodeData {
			if (!this.$store) {
				return
			}
			const state: IState = this.$store.state
			if (state.sigmaInitialized && state.editingCardId) {
				return state.graph.nodes(state.editingCardId)
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
