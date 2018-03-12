import {secondsToPretty, timeFromNow} from '../../core/filters'
import {log} from '../../core/log'
import {inject, injectable} from 'inversify';
import {
    CONTENT_TYPES, IContentData, INewChildTreeMutationArgs,
    INewTreeComponentCreator, ITreeLocationData,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {MUTATION_NAMES} from '../../core/store';
import {Store} from 'vuex';
import Vue from 'vue';
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    let register = require('ignore-styles').default || require('ignore-styles')
    register(['.html', '.less'])
}
import './newTree.less'
let template = require('./newTree.html').default || require('./newTree.html')
@injectable()
export class NewTreeComponentCreator implements INewTreeComponentCreator {
    private store: Store<any>
    constructor(@inject(TYPES.NewTreeComponentCreatorArgs){
       store
   }: NewTreeComponentCreatorArgs) {
        this.store = store
    }
    public create() {
        const me = this
        return {
            template,
            props: ['parentId', 'parentX', 'parentY', 'primaryparenttreecontenturi'],
            created() {
                switch (this.type) {
                    case CONTENT_TYPES.CATEGORY:
                        this.setTypeToCategoryUILogic()
                        break;
                    case CONTENT_TYPES.FACT:
                        this.setTypeToFactUILogic()
                        break;
                }
                console.log('new tree is created')
            },
            mounted() {
                console.log('new tree is mounted')
            },
            data() {
                return {
                    question: '',
                    answer: '',
                    title: '',
                    type: CONTENT_TYPES.FACT
                }
            },
            computed: {
                parentLocation(): ITreeLocationData {
                    return this.$store.getters.treeLocationData(this.parentId)
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
                    return this.type === CONTENT_TYPES.FACT // 'fact'
                },
                contentIsCategory() {
                    return this.type === CONTENT_TYPES.CATEGORY // 'category'
                },
                contentIsSkill() {
                    return this.type === CONTENT_TYPES.SKILL // 'skill'
                },
            },
            methods: {
                createNewTree(
                    {question, answer, title, type}: IContentData
                    = {question: '', answer: '', title: '', type: CONTENT_TYPES.FACT}) {
                    const titleFormatted = title && title.trim() || ''
                    const questionFormatted = question && question.trim() || ''
                    const answerFormatted = answer && answer.trim() || ''
                    const newChildTreeArgs: INewChildTreeMutationArgs = {
                        parentTreeId: this.parentId,
                        timestamp: Date.now(),
                        contentType: type,
                        question: questionFormatted,
                        answer: answerFormatted,
                        title: titleFormatted,
                        parentLocation: this.parentLocation,
                    }
                    me.store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeArgs)
                },
                submitForm() {
                    const newContentData: IContentData = {
                        question: this.question,
                        answer: this.answer,
                        title: this.title,
                        type: this.type
                    }
                    if (!newContentDataValid(newContentData)) {
                        return
                    }
                    this.createNewTree(newContentData)
                    // clear form
                    this.question = ''
                    this.answer = ''
                    this.title = ''
                    // focus cursor
                    switch (this.type) {
                        case CONTENT_TYPES.FACT:
                            this.$refs.question.focus()
                            break
                        case CONTENT_TYPES.CATEGORY:
                            this.$refs.category.focus()
                            break
                    }
                },
                async setTypeToCategory() {
                    this.type = CONTENT_TYPES.CATEGORY
                    this.setTypeToCategoryUILogic()
                },
                async setTypeToFact() {
                    this.type = CONTENT_TYPES.FACT
                    await this.setTypeToFactUILogic()
                },
                async setTypeToAnythingLogic() {
                    await Vue.nextTick
                },
                async setTypeToFactUILogic() {
                    await this.setTypeToAnythingLogic()
                    this.$refs.question.focus()
                },
                async setTypeToCategoryUILogic() {
                    await this.setTypeToAnythingLogic()
                    this.$refs.category.focus()
                },
                setTypeToSkill() {
                    this.type = CONTENT_TYPES.SKILL
                }
            }
        }
    }
}
@injectable()
export class NewTreeComponentCreatorArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
export function newContentDataValid(contentData: IContentData): boolean {
    return !!(contentData &&
        (contentData.title ||
            (contentData.question && contentData.answer)
        )
    )

}
