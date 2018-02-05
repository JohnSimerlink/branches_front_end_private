// import {Trees} from '../../objects/trees'
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
// import {Fact} from '../../objects/fact'
// import ContentItems from '../../objects/contentItems'
//
// import {user} from '../../objects/user'
// import {Heading} from "../../objects/heading";
import {secondsToPretty, timeFromNow} from '../../core/filters'
import {log} from '../../core/log'
// import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {inject, injectable} from 'inversify';
import {
    CONTENT_TYPES, INewChildTreeArgs,
    INewTreeComponentCreator,
    IVuexStore
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store2';
import {Store} from 'vuex';
import Vue from 'vue';
let template = require('./newTree.html').default
if (!template) {
    template = require('./newTree.html')
    // log('newTreeComponentCreator template was not created from .default', template)
} else {
    // log('newTreeComponentCreator template was created from .default', template)
}
if (!template || !Object.keys(template).length) {
    template = '<div>BLANK TEMPLATE</div>'
}
// log('template in newTreeComponent Creator is', template)
// TODO: TEMPLATES still seem to load completely empty during tests . . . ^^
// import {Store} from 'vuex';
// import {MUTATION_NAMES} from '../../core/store2';
// import {Component} from 'vue';
// const template = require('./tree.html').default
// import {Skill} from "../../objects/skill";
// import './tree.less'
// import { mapActions } from 'vuex'
// import message from '../../message'
//
// import store from '../../core/store'
// import {loadDescendants} from "../knawledgeMap/knawledgeMap";
// function refreshGraph() {
//     PubSub.publish('refreshGraph')
// }
// function removeTreeFromGraph(treeId){
//     PubSub.publish('removeTreeFromGraph', treeId)
// }
// function goToFromMap(path){
//     PubSub.publish('goToFromMap', path)
// }
// TODO every time we click on a node a new instance of this vue element is created
// . . . so if you click on the node 5 times 5 instances get created . . .
@injectable()
export class NewTreeComponentCreator implements INewTreeComponentCreator {
    private store: Store<any>
    constructor(@inject(TYPES.NewTreeComponentCreatorArgs){
       store
   }: NewTreeComponentCreatorArgs) {
        this.store = store
        // log('the BRANCHES_STORE store id created in newTreeComponentCreator is', this.store['_id'])
    }
    public create() {
        const me = this
        return {
            template,
            props: ['parentId', 'parentX', 'parentY', 'primaryparenttreecontenturi'],
            created() {
                // log('newTree component created props are ',
                //     this.parentId, this.primaryparenttreecontenturi, this.parentX, this.parentY)
                switch (this.type) {
                    case CONTENT_TYPES.CATEGORY:
                        this.setTypeToCategoryUILogic()
                        break;
                    case CONTENT_TYPES.FACT:
                        this.setTypeToFactUILogic()
                        break;
                }
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
                headingSelectorStyle() {
                    return this.contentIsHeading ?
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
                contentIsHeading() {
                    return this.type === CONTENT_TYPES.CATEGORY // 'heading'
                },
                contentIsSkill() {
                    return this.type === CONTENT_TYPES.SKILL // 'skill'
                },
            },
            methods: {
                createNewTree(
                    {question, answer, title, type}
                    = {question: '', answer: '', title: '', type: CONTENT_TYPES.FACT}) {
                    // log('newtree: createNewTree called', question, answer, title, type)
                    const titleFormatted = title && title.trim() || ''
                    const questionFormatted = question && question.trim() || ''
                    const answerFormatted = answer && answer.trim() || ''
                    // const childX: number = +this.parentX + 10
                    // const childY: number = +this.parentY + 10
                    const newChildTreeArgs: INewChildTreeArgs = {
                        parentTreeId: this.parentId,
                        timestamp: Date.now(),
                        contentType: type,
                        question: questionFormatted,
                        answer: answerFormatted,
                        title: titleFormatted,
                        parentX: parseInt(this.parentX),
                        parentY: parseInt(this.parentY),
                        // x: childX,
                        // y: childY,
                    }
                    log('new child tree args being passed into commit are', newChildTreeArgs)
                    log('newTreeComponentCreator . createNewTree() me.store._id is', me.store['_id'])
                    log('newTreeComponentCreator . createNewTree() store\'s globalStore id is',
                        me.store['globalDataStore']['_globalStoreId'])
                    me.store.commit(MUTATION_NAMES.NEW_CHILD_TREE, newChildTreeArgs)
                },
                submitForm() {
                    this.createNewTree({
                        question: this.question,
                        answer: this.answer,
                        title: this.title,
                        type: this.type
                    })
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
                async setTypeToHeading() {
                    this.type = CONTENT_TYPES.CATEGORY
                    this.setTypeToCategoryUILogic()
                },
                async setTypeToFact() {
                    this.type = CONTENT_TYPES.FACT
                    await this.setTypeToAnythingLogic()
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
