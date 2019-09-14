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
import './cardConfidenceButtons2.less';
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

const template = require('./cardConfidenceButtons2.html').default;

export default {
	template,
	created() {
		console.log('ccb2 created', this.cardId)
	},
	mounted() {
		console.log('ccb2 mounted', this.cardId)
	},
	props: {
		cardId: String,
	},
	data() {
		return {
			cardId: '123'
		};
	},
	watch: {
	},
	computed: {
		node(): ISigmaNodeData {
			const state: IState = this.$store.state
			return state.graph.nodes(this.cardId)
		},
		cardBottom() {
			if (this.node) {
				const bottom = this.cardCenter.y + this.cardHeight / 2
				return bottom
			}
		},
		cardCenter() {
			if (this.node) {
				return {
					x: this.node['renderer1:x'],
					y: this.node['renderer1:y'],
				}
			}
		},
		left() {
			if (this.node) {
				const left = this.cardCenter.x - this.cardWidth / 2
				console.log('cardConfidenceButtons2 left called', left, this.cardCenter.x, this.cardWidth)
				return left
			}
			// this.node()
		},
		cardWidth() {
			if (this.node) {
				const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
				console.log('cardConfidenceButtons2 cardWidth called', this.renderedSize, width)
				return width
			}
		},
		cardHeight() {
			if (!this.node) {
				return
			}
			const height = calcHeight(this.node)
			console.log('cardConfidenceButtons2 cardHeight called', this.renderedSize, height)
			return height
		},
		renderedSize() {
			if (this.node) {
				return this.node['renderer1:size']
			}
		},
		fontSize() {
			return calculateTextSizeFromNodeSize(this.renderedSize)
		}
	},
	methods: {
	}
};
