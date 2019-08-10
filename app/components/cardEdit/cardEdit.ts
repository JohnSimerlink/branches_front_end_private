// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	CONTENT_TYPES,
	IContentData,
	IEditCategoryMutationArgs,
	IEditFactMutationArgs,
	ITreeDataWithoutId,
	ITreeLocationData,
	timestamp,
} from '../../objects/interfaces';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {secondsToPretty} from '../../core/filters';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}
import './cardEdit.less';
import {
	calculateCardHeight,
	calculateCardWidth
} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';

const template = require('./cardEdit.html').default;

export default {
	template,
	props: {
		contentId: String,
		contentString: String,
		content: Object,
		contentTitle: String,
		contentType: String,
		contentQuestion: String,
		contentAnswer: String,
		size: String,
		renderedSize: String,
	},
	beforeCreate() {
		console.log('beforeCreate')
	},
	created() {
		console.log('beforeCreate')
	},
	beforeMount() {
		console.log('beforeMount')
	},
	mounted() {
		console.log('mounted')
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
			keyValue: Math.random()
		};
	},
	computed: {
		// content(): IContentData {
		// 	const contentData = this.$store.getters.contentData(this.contentId) || {};
		// 	return contentData;
		// },
		cardWidth() {
			const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
			console.log('cardEdit cardWidth called', this.renderedSize, width)
			return width
		},
		cardHeight() {
			const height = calculateCardHeight(null, Number.parseInt(this.renderedSize))
			console.log('cardEdit cardHeight called', this.renderedSize, height)
			return height
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
		// global methods
		changeContent() {
			// console.log("cardEdit changeContent called");
			switch (this.contentType) {
				case CONTENT_TYPES.FLASHCARD:
					const editFactMutation: IEditFactMutationArgs = {
						contentId: this.contentId,
						question: this.$refs.question.value,
						answer: this.$refs.answer.value,
					};
					// console.log("cardEdit changeContent flashcard called", editFactMutation);
					this.$store.commit(MUTATION_NAMES.EDIT_FACT, editFactMutation);
					this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					break;
				case CONTENT_TYPES.CATEGORY:
					const editCategoryMutation: IEditCategoryMutationArgs = {
						contentId: this.contentId,
						title: this.$refs.title.value,
					};
					// console.log("cardEdit changeContent category called", editCategoryMutation);
					this.$store.commit(MUTATION_NAMES.EDIT_CATEGORY, editCategoryMutation);
					this.$store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					break;
			}
			this.editing = false;
		},
	}
};
