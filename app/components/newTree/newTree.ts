import {secondsToPretty, timeFromNow} from '../../core/filters';
import {log} from '../../core/log';
import {inject, injectable} from 'inversify';
import {
	CONTENT_TYPES,
	IContentData,
	INewTreeComponentCreator,
	ITreeLocationData,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {Store} from 'vuex';
import Vue from 'vue';
import './newTree.less';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default || require('ignore-styles');
	register(['.html', '.less']);
}
import './newTree.less';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {INewChildTreeMutationArgs, INewChildMapMutationArgs} from '../../core/store/store_interfaces';

let template = require('./newTree.html').default || require('./newTree.html');

@injectable()
export class NewTreeComponentCreator implements INewTreeComponentCreator {
	private store: Store<any>;

	constructor(@inject(TYPES.NewTreeComponentCreatorArgs){
		store
	}: NewTreeComponentCreatorArgs) {
		this.store = store;
	}

	public create() {
		const me = this;
		return {
			template,
			props: ['parentId', 'parentX', 'parentY', 'primaryparenttreecontenturi'],
			async created() {
				await this.focusCursor();
			},
			data() {
				return {
					question: '',
					answer: '',
					title: '',
					type: CONTENT_TYPES.FLASHCARD
				}
			},
			computed: {
				parentLocation(): ITreeLocationData {
					return this.$store.getters.treeLocationData(this.parentId);
				},
				categorySelectorStyle() {
					return this.contentIsCategory ?
						'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
				},
				factSelectorStyle() {
					return this.contentIsFact ?
						'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
				},
				skillSelectorStyle() {
					return this.contentIsSkill ?
						'font-size: 20px;' : ''; // classes weren't working so im inline CSS-ing it
				},
				contentIsFact() {
					return this.type === CONTENT_TYPES.FLASHCARD // 'fact'
				},
				contentIsCategory() {
					return this.type === CONTENT_TYPES.CATEGORY; // 'category'
				},
				contentIsSkill() {
					return this.type === CONTENT_TYPES.SKILL; // 'skill'
				},
				contentIsMap() {
					return this.type === CONTENT_TYPES.MAP; // 'skill'
				},
			},
			methods: {
				createNewTree(
					{question, answer, title, type}: IContentData
						= {question: '', answer: '', title: '', type: CONTENT_TYPES.FLASHCARD}) {
					const titleFormatted = title && title.trim() || '';
					const questionFormatted = question && question.trim() || '';
					const answerFormatted = answer && answer.trim() || '';
					const newChildTreeArgs: INewChildTreeMutationArgs = {
						parentTreeId: this.parentId,
						timestamp: Date.now(),
						contentType: type,
						question: questionFormatted,
						answer: answerFormatted,
						title: titleFormatted,
						parentLocation: this.parentLocation,
					};

					if (this.contentIsMap) {
						const newChildMapArgs: INewChildMapMutationArgs = newChildTreeArgs;
						me.store.commit(MUTATION_NAMES.NEW_CHILD_MAP, newChildMapArgs)
					} else {
						me.store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeArgs);
					}
				},
				async submitForm() {
					const newContentData: IContentData = {
						question: this.question,
						answer: this.answer,
						title: this.title,
						type: this.type
					};
					if (!newContentDataValid(newContentData)) {
						return;
					}
					this.createNewTree(newContentData);
					// clear form
					this.question = '';
					this.answer = '';
					this.title = '';
					// focus cursor
					await this.focusCursor()
				},
				async focusCursor() {
					await Vue.nextTick;
					switch (this.type) {
						case CONTENT_TYPES.FLASHCARD:
							this.$refs.question.focus();
							break;
						case CONTENT_TYPES.CATEGORY:
							this.$refs.category.focus();
							break;
						case CONTENT_TYPES.MAP:
							this.$refs.map.focus();
							break;
					}
				},
				async setTypeToMap() {
					this.type = CONTENT_TYPES.MAP;
					await this.focusCursor();
				},
				async setTypeToCategory() {
					this.type = CONTENT_TYPES.CATEGORY;
					await this.focusCursor();
				},
				async setTypeToFlashcard() {
					this.type = CONTENT_TYPES.FLASHCARD;
					await this.focusCursor();
				},
				async setTypeToSkill() {
					this.type = CONTENT_TYPES.SKILL;
					await this.focusCursor();
				}
			}
		};
	}
}

@injectable()
export class NewTreeComponentCreatorArgs {
	@inject(TYPES.BranchesStore) public store: Store<any>;
}

export function newContentDataValid(contentData: IContentData): boolean {
	return !!(contentData &&
		(contentData.title ||
			(contentData.question && contentData.answer)
		)
	);

}
