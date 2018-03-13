// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {Store} from 'vuex';
import {log} from '../../../app/core/log'
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store';
import {
    CONTENT_TYPES,
    IContentData,
    IContentUserData, IEditCategoryMutationArgs, IEditFactMutationArgs,
    ITreeCreator, ITreeDataWithoutId, ITreeLocationData,
    timestamp,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
    const register = require('ignore-styles').default;
    register(['.html', '.less'])
}
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {secondsToPretty} from '../../core/filters'
const template = require('./tree.html').default;
// import {Store} from 'vuex';
@injectable()
export class TreeCreator implements ITreeCreator {
    private store: Store<any>;
    // private userId: string

    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    // TODO: will this constructor need userId as an arg?
    constructor(@inject(TYPES.TreeCreatorArgs){
         /*userId,*/ store
    }: TreeCreatorArgs ) {
        this.store = store
    }
    public create() {
        const me = this;
        const component = {
            template,
            props: {
                id: String,
                // x: String, // Am I doing this right? should I be giving it a class of Number??
                // y: String, // Am I doing this right? should I be giving it a class of Number??
                parentId: String,
                contentUserId: String,
                contentId: String,
                userId: String,
            },
            // async created() {
            //     if (this.typeIsCategory) {
            //         this.addingChild = true
            //     }
            // },
            mounted() {
                if (this.typeIsCategory) {
                    this.addingChild = true
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
                }
            },
            computed: {
                treeData() {
                    const treeData: ITreeDataWithoutId = me.store.getters.contentData(this.id) || {};
                    return treeData
                },
                treeLocationData() {
                    const treeLocationData: ITreeLocationData = me.store.getters.treeLocationData(this.id) || {};
                    return treeLocationData
                },
                x(): string {
                    const x = this.treeLocationData.point && this.treeLocationData.point.x;
                    return x
                },
                y(): string {
                    const y = this.treeLocationData.point && this.treeLocationData.point.y;
                    return y
                },
                content(): IContentData {
                    const contentData = me.store.getters.contentData(this.contentId) || {};
                    return contentData
                },
                contentUserDataLoaded() {
                    return this.contentUserData && Object.keys(this.contentUserData).length
                },
                contentUserData() {
                    const contentUserData = me.store.getters.contentUserData(this.contentUserId) || {};
                    this.proficiencyInput = contentUserData.proficiency || PROFICIENCIES.UNKNOWN;
                    return contentUserData
                },
                nextReviewTime(): timestamp {
                    return this.contentUserData.nextReviewTime
                },
                timer() {
                    let timer = 0;

                    if (this.contentUserData.timer) {
                        timer = this.contentUserData.timer
                    }
                    return timer
                },
                typeIsCategory() {
                    return this.content.type === CONTENT_TYPES.CATEGORY
                },
                myComputedProp() {
                  return 'we done'
                },
                typeIsFact() {
                    return this.content.type === CONTENT_TYPES.FACT
                },
                typeIsSkill() {
                    return this.content.type === CONTENT_TYPES.SKILL
                },
                typeIsMap() {
                    return this.content.type === CONTENT_TYPES.MAP
                },
                styleObject() {
                    const styles = {};
                    styles['background-color'] = 'gray';
                    if (this.typeIsCategory) {
                        styles['background-color'] = 'black';
                        styles['color'] = 'white'
                    } else {
                        // if ()
                        const proficiency = this.proficiencyInput;
                        // ^^ this.contentUserData.sampleContentUser1Proficiency || PROFICIENCIES.UNKNOWN
                        styles['background-color'] = ProficiencyUtils.getColor(proficiency);
                        if (this.showHistory) {
                            styles['background-color'] = 'black';
                            styles['color'] = 'white'
                        }
                    }
                    return styles
                },
                timerMouseOverMessage() {
                    return 'You have spent ' + secondsToPretty(this.timer) + 'studying this item'
                },
                numChildren() {
                    return 0
                    // return this.tree && this.tree.children instanceof Object
                    // ? Object.keys(this.tree.children).length : 0
                },
                stringifiedContentUserData() {
                    return JSON.stringify(this.contentUserData)
                }
            },
            methods: {
                aMethod() {
                    for (let i = 0; i < 2; i++) {
                        log('i ', i)
                    }
                },
                toggleEditing() {
                    this.editing = !this.editing
                },
                toggleAddChild() {
                    this.addingChild = !this.addingChild
                },
                toggleHistory() {
                    if (this.typeIsCategory) {
                        return
                    }
                    this.showHistory = !this.showHistory
                },
                toggleEditingAndAddChild() {
                    this.addingChild = !this.addingChild;
                    this.editing = this.addingChild
                },
                proficiencyClicked(proficiency) {
                    this.proficiencyInput = proficiency;
                    const contentUserId = this.contentUserId;
                    const timestamp = Date.now();
                    if (!this.contentUserDataLoaded) {
                        log(
                            'ADD CONTENT INTERACTION IF NO CONTENT USER DATA ABOUT TO BE CALLED'
                        );
                        const contentUserData = me.store.commit(
                            MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
                            {
                                contentUserId,
                                proficiency,
                                timestamp,
                            }
                        )
                    } else {
                        log(
                            'ADD CONTENT INTERACTION ABOUT TO BE CALLED '
                        );
                        me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
                            contentUserId,
                            proficiency,
                            timestamp
                        })
                    }
                },
                // unnecessary now that tree chain is composed of categories/categorys whose nodes dont have one color
                // global methods
                changeContent() {
                    switch (this.content.type) {
                        case CONTENT_TYPES.FACT:
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
                    this.editing = false
                },
            }
        };
        return component
        // return {} as Component
    }
}
@injectable()
export class TreeCreatorArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
