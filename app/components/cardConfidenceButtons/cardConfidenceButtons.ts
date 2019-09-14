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
import './cardConfidenceButtons.less';
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

const template = require('./cardConfidenceButtons.html')

export default {
	template,
	props: {
		cardId: String,
		contentId: String
	},
	mounted() {
	},
	data() {
		return {
		};
	},
	watch: {
	},
	computed: {

		// location(): ITreeLocationData {
		// 	const loc =  this.$store.getters.treeLocationData(this.cardId);
		// 	console.log('parent location data is ', loc)
		// 	return loc
		// 	// return loc
		// },
		// top() {
		// 	if (this.node) {
		// 		const top = this.node['renderer1:y'] - this.cardHeight / 2
		// 		return top
		// 	}
		// },
		// bottom() {
		// 	if (this.node) {
		// 		const bottom = this.node['renderer1:y'] + this.cardHeight / 2
		// 		return bottom
		// 	}
		// },
		// cardCenter() {
		// 	if (this.node) {
		// 		return this.node['renderer1:x']
		// 	}
		// },
		// left() {
		// 	if (this.node) {
		// 		const left = this.node['renderer1:x'] - this.cardWidth / 2
		// 		return left
		// 	}
		// 	// this.node()
		// },
		// node(): ISigmaNodeData {
		// 	if (!this.$store) {
		// 		return
		// 	}
		// 	const state: IState = this.$store.state
		// 	if (state.sigmaInitialized && this.cardId) {
		// 		return state.graph.nodes(this.cardId)
		// 	}
		// },
		// renderedSize() {
		// 	if (this.node) {
		// 		return this.node['renderer1:size']
		// 	}
		// },
		// cardWidth() {
		// 	if (this.node) {
		// 		const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
		// 		console.log('cardEdit cardWidth called', this.renderedSize, width)
		// 		return width
		// 	}
		// },
		// cardHeight() {
		// 	if (!this.node) {
		// 		return
		// 	}
		// 	const height = calcHeight(this.node)
		// 	console.log('cardEdit cardHeight called', this.renderedSize, height)
		// 	return height
		// },
		// fontSize() {
		// 	const size = calculateTextSizeFromNodeSize(this.renderedSize)
		// 	return size
		// },
		// typeIsCategory() {
		// 	return this.contentType === CONTENT_TYPES.CATEGORY;
		// },
		// typeIsFlashcard() {
		// 	return this.contentType === CONTENT_TYPES.FLASHCARD;
		// },
		// typeIsSkill() {
		// 	return this.contentType === CONTENT_TYPES.SKILL;
		// },
		// typeIsMap() {
		// 	return this.contentType === CONTENT_TYPES.MAP;
		// },
	},
	methods: {
	}
};
