// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	CONTENT_TYPES,
	IEditCardLocallyMutationArgs,
	IEditCardTitleLocallyMutationArgs,
	IEditCategoryMutationArgs,
	IEditFlashcardMutationArgs,
	IFlipCardMutationArgs,
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
import {cardCenter} from '../cardAddButton/cardAddButton';

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
		// console.log('cardEdit2 beforeCreate')
	},
	created() {
		// console.log('beforeCreate')
	},
	beforeMount() {
		// console.log('beforeMount')
	},
	mounted() {
		// console.log('mounted')
		if (this.node) {
			switch (this.contentType) {
				case CONTENT_TYPES.FLASHCARD: {
					if (!this.flipped) {
						this.$refs.question.focus()
					} else {
						this.$refs.answer.focus()
					}
					break
				}
				case CONTENT_TYPES.CATEGORY: {
					this.$refs.title.focus()
					break
				}
				default:
					break;
			}
		}
	},
	beforeUpdate() {
		// console.log('beforeUpdate')

	},
	updated() {
		// console.log('updated')
	},
	beforeDestroy() {
		// console.log('beforeDestroy')
	},
	destroyed() {
		// console.log('destroyed')
	},
	data() {
		return {
		};
	},
	watch: {
		contentTitle() {
			if (this.$refs.title) {
				// console.log('contentTitle just changed', this.$refs.title.value, this.$refs.title.value.trim())
				this.$refs.title.value = this.$refs.title.value.trim();
				this.resize();
			}
			setTimeout(() => {
				if (!this.$refs.title) {
					return
				}
				// console.log('WAIT 100contentTitle just changed', this.$refs.title.value, this.$refs.title.value.trim())
				this.$refs.title.value = this.$refs.title.value.trim();
				this.$refs.title.focus();

			}, 50) //HACK
		},

		question() {
			if (this.$refs.question) {
				this.$refs.question.value = this.$refs.question.value.trim();
				this.resize();
			}
			setTimeout(() => {
				if (!this.$refs.question) {
					return
				}
				// console.log('WAIT 100contentTitle just changed', this.$refs.question.value, this.$refs.question.value.trim())
				this.$refs.question.value = this.$refs.question.value.trim();
				this.$refs.question.focus();

			}, 50) //HACK
		},
		answer() {
			if (this.$refs.answer) {
				this.$refs.answer.value = this.$refs.answer.value.trim();
				this.resize();
			}
			setTimeout(() => {
				if (!this.$refs.answer) {
					return
				}
				// console.log('WAIT 100contentTitle just changed', this.$refs.answer.value, this.$refs.answer.value.trim())
				this.$refs.answer.value = this.$refs.answer.value.trim();
				this.$refs.answer.focus();

			}, 50) // HACK
		}
	},
	computed: {
		cardCenter,
		left() {
			if (this.node) {
				const left = this.cardCenter.x - this.cardWidth / 2
				return left
			}
			// this.node()
		},
		top() {
			if (this.node) {
				const top = this.node['renderer1:y'] - this.cardHeight / 2
				return top
			}
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
		question() {
			if (this.node) {
				// console.log('content title is ', this.node.content.title, this.$refs.title.value)
				const state: IState = this.$store.state
				return state.editingCardQuestion || this.node.content.question;
			}
		},
		answer() {
			if (this.node) {
				// console.log('content title is ', this.node.content.title, this.$refs.title.value)
				const state: IState = this.$store.state
				return state.editingCardAnswer || this.node.content.answer;
			}
		},
		contentType() {
			if (this.node) {
				return this.node.content.type
			}
		},
		proficiency(): PROFICIENCIES {
			if (this.node) {
				return this.node.contentUserData && this.node.contentUserData.proficiency || PROFICIENCIES.UNKNOWN
			}
		},
		// content(): IContentData {
		// 	const contentData = this.$store.getters.contentData(this.contentId) || {};
		// 	return contentData;
		// },
		nodeColor() {
			const color = ProficiencyUtils.getColorFromMapState(this.proficiency, MAP_STATES.MAIN)
			// console.log('cardEdit2.ts node-color is', color)
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
				return width
			}
		},
		cardHeight() {
			if (!this.node) {
				return
			}
			const height = calcHeight(this.node)
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
		flipped() {
			return this.node.flipped
		}
	},
	methods: {
		flip() {
			// this.node.flip()
			const flipMutationArgs: IFlipCardMutationArgs = {
				sigmaId: this.node.id
			}
			this.$store.commit(MUTATION_NAMES.FLIP_FLASHCARD, flipMutationArgs)

			if (this.flipped) {
				setTimeout(() => {
					this.$refs.answer.focus();
				}, 0)
			} else {

				setTimeout(() => {
					this.$refs.question.focus();
				}, 0)
			}

		},
		keypressed(e) {
			console.log('cardEdit2.ts keypressed', e, arguments)
		},
		keydowned(e) {
			console.log('cardEdit2.ts keydowned', e, arguments)
			if (e.which === 9 /*TAB */) {
				this.saveContentChangeLocally()
				if (e.preventDefault) {
					e.preventDefault()
					this.flip();
				} else {
					this.flip();
					return false
				}
			}
			e.stopPropagation()
		},
		keyupped(e) {
			console.log('cardEdit2.ts keyupped', e, arguments)

			this.resize();
			this.saveContentChangeLocally();

		},
		resize() {
			if (this.$refs.title) {
				this.$refs.title.style.height = 'auto'
				this.$refs.title.style.height = this.$refs.title.scrollHeight + 'px'
			}
			if (this.$refs.question) {
				this.$refs.question.style.height = 'auto'
				this.$refs.question.style.height = this.$refs.question.scrollHeight + 'px'
			}
			if (this.$refs.answer) {
				this.$refs.answer.style.height = 'auto'
				this.$refs.answer.style.height = this.$refs.answer.scrollHeight + 'px'
			}
		},
		// global methods
		saveContentChangeLocally() {
			// console.log("cardEdit saveContentChangeLocally called");
			switch (this.contentType) {
				// case CONTENT_TYPES.FLASHCARD:
				// 	const editFactMutation: IEditFlashcardMutationArgs = {
				// 		contentId: this.contentId,
				// 		question: this.$refs.question.value,
				// 		answer: this.$refs.answer.value,
				// 	};
				// 	// console.log("cardEdit saveContentChangeLocally flashcard called", editFactMutation);
				// 	this.$store.commit(MUTATION_NAMES.EDIT_FLASHCARD, editFactMutation);
				// 	this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
				// 	break;
				case CONTENT_TYPES.CATEGORY: {
					const editCardTitleLocallyMutation: IEditCardTitleLocallyMutationArgs = {
						title: this.$refs.title.value,
					};
					this.$store.commit(MUTATION_NAMES.EDIT_CARD_TITLE_LOCALLY, editCardTitleLocallyMutation);
					// const editCategoryMutation: IEditCategoryMutationArgs = {
					// 	contentId: this.contentId,
					// 	title: this.$refs.title.value,
					// };
					// console.log("cardEdit saveContentChangeLocally category called", editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.EDIT_CATEGORY, editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					break;
				}
				case CONTENT_TYPES.FLASHCARD: {
					// console.log('saveContentChangeLocally for flashcard called')
					let questionVal
					let answerVal
					if (this.$refs.question) {
						questionVal = this.$refs.question.value
					} else {
						questionVal = this.question
					}
					if (this.$refs.answer) {
						answerVal = this.$refs.answer.value
					} else {
						answerVal = this.answer
					}
					// console.log('saveContentChangeLocally flashcard', questionVal, answerVal)
					if (questionVal && answerVal) {
						const editCardLocallyMutation: IEditCardLocallyMutationArgs = {
							question: questionVal,
							answer: answerVal,
						};
						this.$store.commit(MUTATION_NAMES.EDIT_CARD_LOCALLY, editCardLocallyMutation);
					}
					// const editCategoryMutation: IEditCategoryMutationArgs = {
					// 	contentId: this.contentId,
					// 	title: this.$refs.title.value,
					// };
					// console.log("cardEdit saveContentChangeLocally category called", editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.EDIT_CATEGORY, editCategoryMutation);
					// this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					break;
				}
			}
			this.editing = false;
		},
	}
};
