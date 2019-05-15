// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {
	inject,
	injectable
} from 'inversify';
import 'reflect-metadata';
import {Store} from 'vuex';
import {log} from '../../../app/core/log';
import {
	CONTENT_TYPES,
	ICardMainCreator,
	IContentData,
	IEditCategoryMutationArgs,
	IEditFactMutationArgs,
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

const template = require('./cardMain.html').default;

// import {Store} from 'vuex';
@injectable()
export class CardMainCreator implements ICardMainCreator {
	private store: Store<any>;
	// private userId: string

	/* TODO: Each of these loaders should have baked into them certain auth cookies
	 that determine whether or not they are actually permitted to load the data
		*/

	// TODO: will this constructor need userId as an arg?
	constructor(@inject(TYPES.CardMainCreatorArgs){
		/*userId,*/ store
	}: CardMainCreatorArgs) {
		this.store = store;
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
				content(): IContentData {
					const contentData = me.store.getters.contentData(this.contentId) || {};
					return contentData;
				},
				contentUserDataLoaded() {
					return this.contentUserData && Object.keys(this.contentUserData).length;
				},
				contentUserData() {
					const contentUserData = me.store.getters.contentUserData(this.contentUserId) || {};
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

					styles[backgroundColor] = 'white';
					styles[color] = '#18008e';
					// styles['border-radius'] = '10px';
					if (this.typeIsCategory) {

						styles[backgroundColor] = 'white';
						styles[color] = '#18008e';
					} else {
						// if ()
						const proficiency = this.proficiencyInput;
						// ^^ this.contentUserData.sampleContentUser1Proficiency || PROFICIENCIES.UNKNOWN
						styles[backgroundColor] = ProficiencyUtils.getColor(proficiency);
						styles[color] = 'black';
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
				aMethod() {
				},
				toggleEditing() {
					this.editing = !this.editing;
				},
				toggleAddChild() {
					this.addingChild = !this.addingChild;
				},
				toggleHistory() {
					if (this.typeIsCategory) {
						return;
					}
					this.showHistory = !this.showHistory;
				},
				toggleEditingAndAddChild() {
					this.addingChild = !this.addingChild;
					this.editing = this.addingChild;
				},
				proficiencyClicked(proficiency) {
					this.proficiencyInput = proficiency;
					const contentUserId = this.contentUserId;
					const currentTime = Date.now();
					log('cardMain proficiency clicked')
					if (!this.contentUserDataLoaded) {
						log(
							'ADD CONTENT INTERACTION IF NO CONTENT USER DATA ABOUT TO BE CALLED'
						);
						const contentUserData = me.store.commit(
							MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
							{
								contentUserId,
								proficiency,
								timestamp: currentTime,
							}
						);
					} else {
						log(
							'ADD CONTENT INTERACTION ABOUT TO BE CALLED '
						);
						me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
							contentUserId,
							proficiency,
							timestamp: currentTime
						});
					}
					me.store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
					me.store.commit(MUTATION_NAMES.JUMP_TO_NEXT_FLASHCARD_IF_IN_PLAYING_MODE);
					me.store.commit(MUTATION_NAMES.REFRESH); // needed to get rid of label disappearing bug
				},
				// unnecessary now that tree chain is composed of categories/categorys whose nodes dont have one color
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
				studyCategory() {
					const playTreeMutationArgs: IPlayTreeMutationArgs = {
						treeId: this.id
					};
					this.$store.commit(MUTATION_NAMES.PLAY_TREE, playTreeMutationArgs);
				},
			}
		};
		return component;
		// return {} as Component
	}
}

@injectable()
export class CardMainCreatorArgs {
	@inject(TYPES.BranchesStore) public store: Store<any>;
}
