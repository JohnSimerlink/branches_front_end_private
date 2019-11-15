// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	CONTENT_TYPES,
	IEditCardTitleLocallyMutationArgs,
	ISetEditingCardMutationArgs,
	ISigmaNodeData,
	IState,
	ITreeLocationData,
} from '../../objects/interfaces';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import './cardActionButtons.less';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {
	calcHeight,
	calculateTextSizeFromNodeSize
} from '../../../other_imports/sigma/renderers/canvas/getDimensions';
import {MAP_STATES} from '../../objects/mapStateManager/MAP_STATES';
import {INewChildTreeMutationArgs} from '../../core/store/store_interfaces';
import {Store} from 'vuex';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardActionButtons.html').default;

export default {
	template,
	props: {
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
			return loc
			// return loc
		},
		hoveringCardId() {
			const id =  this.$store.state.hoveringCardId
			return id
		},
		cardTop() {
			if (this.node) {
				const top = this.cardCenter.y - this.cardHeight / 2
				console.log('cardTop is ', top)
				return top
			}
		},
		cardBottom() {
			if (this.node) {
				const bottom = this.cardCenter.y + this.cardHeight / 2
				console.log('cardBottom is ', bottom)
				return bottom
			}
		},
		cardCenter,
		cardLeft() {
			if (this.node) {
				const left = this.cardCenter.x - this.cardWidth / 2
				return left
			}
			// this.node()
		},
		cardRight() {
			if (this.node) {
				const right = this.cardCenter.x + this.cardWidth / 2
				return right
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
			const size = calculateTextSizeFromNodeSize(this.renderedSize) // * .667
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
			createNewCardAndStartEditing(this.hoveringCardId, this.location, this.$store, this.node)
			// const newChildTreeMutationArgs: INewChildTreeMutationArgs = {
			// 	parentTreeId: this.hoveringCardId,
			// 	timestamp: Date.now(),
			// 	contentType: CONTENT_TYPES.FLASHCARD,
			// 	question: 'Type a question for your flashcard here',
			// 	answer: 'Type an answer for your flashcard here',
			// 	title: '',
			// 	parentLocation: this.location,
			// }
			// const oldChildren = this.node.children
			// this.$store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeMutationArgs);
			// // const oldChildren = this.node.children
			// const newChildId = this.node.children.find(childId => !oldChildren.includes(childId))
			// const newChild: ISigmaNodeData = this.$store.state.graph.nodes(newChildId)
			// const setCardEditingArgs: ISetEditingCardMutationArgs = {
			// 	contentId: newChild.contentId,
			// 	sigmaId: newChildId
			// }
			// this.$store.commit(MUTATION_NAMES.SET_EDITING_CARD, setCardEditingArgs);
		},
		keypressed() {
			this.resize();
			this.saveContentChangeLocally();

		},
		resize() {
			this.$refs.title.style.height = 'auto'
			this.$refs.title.style.height = this.$refs.title.scrollHeight + 'px'
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
				case CONTENT_TYPES.CATEGORY:
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
			this.editing = false;
		},
	}
};
export function cardCenter() {
	if (this.node) {
		return {
			x: this.node['renderer1:x'],
			y: this.node['renderer1:y'],
		}
	}
}
export function createNewCardAndStartEditing(parentTreeId, parentLocation: ITreeLocationData, store: Store<IState>, nodeData: ISigmaNodeData) {

	const newChildTreeMutationArgs: INewChildTreeMutationArgs = {
		parentTreeId,
		timestamp: Date.now(),
		contentType: CONTENT_TYPES.FLASHCARD,
		question: 'Type a question for your flashcard here',
		answer: 'Type an answer for your flashcard here',
		title: '',
		parentLocation,
	}
	const oldChildren = nodeData.children
	store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeMutationArgs);
	// const oldChildren = this.node.children
	const newChildId = nodeData.children.find(childId => !oldChildren.includes(childId))
	const newChild: ISigmaNodeData = store.state.graph.nodes(newChildId)
	const setCardEditingArgs: ISetEditingCardMutationArgs = {
		contentId: newChild.contentId,
		sigmaId: newChildId
	}
	store.commit(MUTATION_NAMES.SET_EDITING_CARD, setCardEditingArgs);
}
