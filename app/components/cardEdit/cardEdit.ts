// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {Store} from 'vuex';
import {log} from '../../../app/core/log';
import {
	CONTENT_TYPES,
	IContentData,
	IEditCategoryMutationArgs,
	IEditFactMutationArgs,
	ICardMainCreator,
	ITreeDataWithoutId,
	ITreeLocationData,
	timestamp,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {secondsToPretty} from '../../core/filters';
import {IPlayTreeMutationArgs} from '../../core/store/store_interfaces';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardEdit.html').default;

export default {
	template,
	props: {
		id: String,
		parentId: String,
		contentUserId: String,
		contentId: String,
		userId: String,
	},
	mounted() {
		if (this.typeIsCategory) {
			this.addingChild = true;
		}
	},
	data() {
		return {
			tree: {}, // this.tree
			// content: {}, // this.content
			editing: false,
			showHistory: false,
			addingChild: false,
			user: {},
			contentUserDataLocal: null,
			proficiencyInput: PROFICIENCIES.UNKNOWN,
		};
	},
	computed: {
		treeData() {
			const treeData: ITreeDataWithoutId = this.$store.getters.contentData(this.id) || {};
			return treeData;
		},
		treeLocationData() {
			const treeLocationData: ITreeLocationData = this.$store.getters.treeLocationData(this.id) || {};
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
		content(): IContentData {
			const contentData = this.$store.getters.contentData(this.contentId) || {};
			return contentData;
		},
		contentUserDataLoaded() {
			return this.contentUserData && Object.keys(this.contentUserData).length;
		},
		contentUserData() {
			const contentUserData = this.$store.getters.contentUserData(this.contentUserId) || {};
			this.proficiencyInput = contentUserData.proficiency || PROFICIENCIES.UNKNOWN;
			return contentUserData;
		},
		nextReviewTime(): timestamp {
			return this.contentUserData.nextReviewTime;
		},
		timer() {
			let timer = 0;

			if (this.contentUserData.timer) {
				timer = this.contentUserData.timer;
			}
			return timer;
		},
		typeIsCategory() {
			return this.content.type === CONTENT_TYPES.CATEGORY;
		},
		myComputedProp() {
			return 'we done';
		},
		typeIsFlashcard() {
			return this.content.type === CONTENT_TYPES.FLASHCARD;
		},
		typeIsSkill() {
			return this.content.type === CONTENT_TYPES.SKILL;
		},
		typeIsMap() {
			return this.content.type === CONTENT_TYPES.MAP;
		},
		styleObject() {
			const styles = {};
			const color: string = 'color';
			const backgroundColor: string = 'background-color';

			styles[backgroundColor] = 'gray';
			// styles['border-radius'] = '10px';
			if (this.typeIsCategory) {

				styles[backgroundColor] = 'black';
				styles[color] = 'white';
			} else {
				// if ()
				const proficiency = this.proficiencyInput;
				// ^^ this.contentUserData.sampleContentUser1Proficiency || PROFICIENCIES.UNKNOWN
				styles[backgroundColor] = ProficiencyUtils.getColor(proficiency);
				if (this.showHistory) {
					styles[backgroundColor] = 'black';
					styles[color] = 'white';
				}
			}
			return styles;
		},
		timerMouseOverMessage() {
			return 'You have spent ' + secondsToPretty(this.timer) + 'studying this item';
		},
		numChildren() {
			return 0;
			// return this.tree && this.tree.children instanceof Object
			// ? Object.keys(this.tree.children).length : 0
		},
		stringifiedContentUserData() {
			return JSON.stringify(this.contentUserData);
		}
	},
	methods: {
		// global methods
		changeContent() {
			switch (this.content.type) {
				case CONTENT_TYPES.FLASHCARD:
					const editFactMutation: IEditFactMutationArgs = {
						contentId: this.contentId,
						question: this.$refs.question.value,
						answer: this.$refs.answer.value,
					};
					this.$store.commit(MUTATION_NAMES.EDIT_FACT, editFactMutation);
					break;
				case CONTENT_TYPES.CATEGORY:
					const editCategoryMutation: IEditCategoryMutationArgs = {
						contentId: this.contentId,
						title: this.$refs.title.value,
					};
					this.$store.commit(MUTATION_NAMES.EDIT_CATEGORY, editCategoryMutation);
					break;
			}
			this.editing = false;
		},
	}
};
