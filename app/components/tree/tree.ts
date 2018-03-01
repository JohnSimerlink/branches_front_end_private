// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {Store} from 'vuex';
import {log} from '../../../app/core/log'
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store';
import {
    IContentUserData,
    ITreeCreator, ITreeDataWithoutId, ITreeLocationData,
    timestamp,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles').default
    register(['.html', '.less'])
}
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {secondsToPretty} from '../../core/filters'
const template = require('./tree.html').default
// import {Store} from 'vuex';
@injectable()
export class TreeCreator implements ITreeCreator {
    private store: Store<any>
    // private userId: string

    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    // TODO: will this constructor need userId as an arg?
    constructor(@inject(TYPES.TreeCreatorArgs){
         /*userId,*/ store
    }: TreeCreatorArgs ) {
        this.store = store
        // this.userId = userId
    }
    public create() {
        const me = this
        const component = {
            template,
            // '<div>This is the template for tree.html</div>',
            // require('./tree.html'), // '<div> {{movie}} this is the tree template</div>',
            props: {
                id: String,
                // x: String, // Am I doing this right? should I be giving it a class of Number??
                // y: String, // Am I doing this right? should I be giving it a class of Number??
                parentId: String,
                contentUserId: String,
                contentId: String,
                userId: String,
            },
            async created() {
                if (this.typeIsHeading) {
                    this.addingChild = true
                }
            },
            mounted() {
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
            watch: {
                // //stop sampleContentUser1Timer when
                // openNodeId(newNodeId, oldNodeId){
                //     if (oldNodeId === this.tree.id && this.tree.id !== newNodeId){
                //         this.content.saveTimer()
                //     } else {
                //     }
                // }
            },
            computed: {
                treeData() {
                    const treeData: ITreeDataWithoutId = me.store.getters.contentData(this.id) || {}
                    return treeData
                },
                treeLocationData() {
                    const treeLocationData: ITreeLocationData = me.store.getters.treeLocationData(this.id) || {}
                    return treeLocationData
                },
                x(): string {
                    const x = this.treeLocationData.point && this.treeLocationData.point.x
                    return x
                },
                y(): string {
                    const y = this.treeLocationData.point && this.treeLocationData.point.y
                    return y
                },
                content() {
                    const contentData = me.store.getters.contentData(this.contentId) || {}
                    return contentData
                },
                contentUserDataLoaded() {
                    return this.contentUserData && Object.keys(this.contentUserData).length
                },
                contentUserData() {
                    const contentUserData = me.store.getters.contentUserData(this.contentUserId) || {}
                    this.proficiencyInput = contentUserData.proficiency || PROFICIENCIES.UNKNOWN
                    // if (Object.keys(contentUserData).length) {
                    //     this.contentUserDataLoaded = true // TODO: << figure out what this does
                    //     log('contentUserData loaded is true', contentUserData)
                    // } else {
                    //     log('contentUserData loaded is false', contentUserData)
                    // }
                    // this.contentUserDataLoaded = false
                    // if (this.contentUserDataLocal) {
                    //     return this.contentUserDataLocal
                    // }
                    // if (!this.contentUserDataString) {
                    //     return {}
                    // }
                    // // const content
                    // const contentUserData: IContentUserData = JSON.parse(this.contentUserDataString)
                    //
                    // this.proficiencyInput = contentUserData.sampleContentUser1Proficiency
                    // this.contentUserDataLoaded = true
                    return contentUserData
                },
                nextReviewTime(): timestamp {
                    return this.contentUserData.nextReviewTime
                },
                // sampleContentUser1Proficiency() {
                //     return this.contentUserData.sampleContentUser1Proficiency || PROFICIENCIES.UNKNOWN
                // },
                timer() {
                    let timer = 0

                    if (this.contentUserData.timer) {
                        timer = this.contentUserData.timer
                    }
                    return timer
                },
                // openNodeId(){
                //     return this.$store.state.openNodeId;
                // },
                typeIsHeading() {
                    const isHeading = this.content.type === 'heading' || this.tree.contentType === 'heading'
                    return this.content.type === 'heading'
                        || this.tree.contentType === 'heading' // backwards compatibility
                },
                typeIsFact() {
                    return this.content.type === 'fact'
                        || this.tree.contentType === 'fact' // backwards compatibility
                },
                typeIsSkill() {
                    return this.content.type === 'skill'
                        || this.tree.contentType === 'skill' // backwards compatibility
                },
                styleObject() {
                    const styles = {}
                    styles['background-color'] = 'gray'
                    if (this.typeIsHeading) {
                        styles['background-color'] = 'black';
                        styles['color'] = 'white'
                    } else {
                        // if ()
                        const proficiency = this.proficiencyInput
                        // ^^ this.contentUserData.sampleContentUser1Proficiency || PROFICIENCIES.UNKNOWN
                        styles['background-color'] = ProficiencyUtils.getColor(proficiency)
                        if (this.showHistory) {
                            styles['background-color'] = 'black'
                            styles['color'] = 'white'
                        }
                    }
                    // console.log('trees style branchesMap is ', styles)
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
                // ...mapActions(['itemStudied']),
                // // ...mapAction
                // //user methods
                startTimer() {
                    // this.content.startTimer()
                },
                saveTimer() {
                    // this.content.saveTimer()
                },
                toggleEditing() {
                    this.editing = !this.editing
                },
                toggleAddChild() {
                    this.addingChild = !this.addingChild
                },
                toggleHistory() {
                    if (this.typeisHeading) {
                        return
                    }
                    this.showHistory = !this.showHistory
                },
                toggleEditingAndAddChild() {
                    this.addingChild = !this.addingChild
                    this.editing = this.addingChild
                },
                studySkill() {
                    // goToFromMap({name: 'study', params: {leafId: this.id}})
                    // this.$router.push()
                },
                studyHeading() {
                    // console.log('study HEADING called!')
                    // this.$store.commit('setCurrentStudyingTree', this.id)
                    // this.$store.commit('enterStudyingMode')
                    // // goToFromMap({name: 'study', params: {leafId: this.id}})
                    // this.$router.push()
                },
                clearHeading() {
                    // this.tree.clearChildrenInteractions()
                },
                proficiencyClicked(proficiency) {
                    this.proficiencyInput = proficiency
                    const contentUserId = this.contentUserId
                    const timestamp = Date.now()
                    if (!this.contentUserDataLoaded) {
                        log(
                            'ADD CONTENT INTERACTION IF NO CONTENT USER DATA ABOUT TO BE CALLED'
                        )
                        const contentUserData = me.store.commit(
                            MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
                            {
                                contentUserId,
                                proficiency,
                                timestamp,
                            }
                        )
                        // this.contentUserDataLocal = contentUserData
                        // ;this.contentUserData; // trigger update
                        // ;this.stringifiedContentUserData; // trigger update // << TODO: figure out if these are necessary
                    } else {
                        log(
                            'ADD CONTENT INTERACTION ABOUT TO BE CALLED '
                        )
                        me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
                            contentUserId,
                            proficiency,
                            timestamp
                        })
                    }
                    // me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
                    //     contentUserId: this.contentUserId,
                    //     sampleContentUser1Proficiency, // NOTICE HOW `this` is different from `me`
                    //     timestamp: Date.now()
                    // })
                    //     user.addMutation('interaction', {contentId: this.content.id,
                    // sampleContentUser1Proficiency: this.content.sampleContentUser1Proficiency, timestamp: Date.now()})
                    //     store.commit('itemStudied', this.content.id)
                    //     this.tree.setInactive()
                    //     // stores.commit('closeNode', this.id)
                },
                // unnecessary now that tree chain is composed of categories/headings whose nodes dont have one color
                async syncTreeChainWithUI() {
                    // this.syncGraphWithNode()
                    // let parentId = this.tree.treeDataFromDB.parentId;
                    // let parent
                    // let num = 1
                    // while (parentId) {
                    //     // syncGraphWithNode(parentId)
                    //     store.commit('syncGraphWithNode', parentId)
                    //     // PubSub.publish('syncGraphWithNode', parentId)
                    //     parent = await Trees.get(parentId)
                    //     parentId = parent.treeDataFromDB.parentId
                    //     num++
                    // }
                },
                syncGraphWithNode() {
                    // // syncGraphWithNode(this.tree.id)
                    // store.commit('syncGraphWithNode', this.tree.id)
                    // // PubSub.publish('syncGraphWithNode', this.tree.id)
                },
                // global methods
                changeContent() {
                    // switch (this.content.type) {
                    //     case 'fact':
                    //         var fact = new Fact({question: this.content.question, answer: this.content.answer})
                    //         this.content = ContentItems.create(fact)
                    //         break;
                    //     case 'heading':
                    //         const heading = new Heading({title: this.content.title})
                    //         this.content = ContentItems.create(heading)
                    //         break;
                    //     case 'skill':
                    //         const skill = new Skill({title: this.content.title})
                    //         this.content = ContentItems.create(skill)
                    //         break;
                    // }
                    // this.content.addTree(this.id)
                    // this.tree.changeContent(this.content.id, this.tree.contentType)
                    //
                    // this.toggleEditing()
                    // this.syncGraphWithNode()
                },
                async remove() {
                    //     if (confirm("Warning! Are you sure you would you like to delete
                    // this tree AND all its children?
                    // THIS CANNOT BE UNDONE")) {
                    //         removeTreeFromGraph(this.id)
                    //         return this.tree.remove()
                    //     }
                },
            }
        }
        return component
        // return {} as Component
    }
}
@injectable()
export class TreeCreatorArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
