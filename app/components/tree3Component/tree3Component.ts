// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {Store} from 'vuex';
import {log} from '../../../app/core/log'
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store2';
import {
    IContentUserData,
    ITree3Creator
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles').default
    register(['.html', '.less'])
}
import './knawledgeMap.less'
import {ProficiencyUtils} from '../../objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {secondsToPretty} from '../../core/filters'
import {escape} from '../../objects/tooltipOpener/tooltipRenderer';
const template = require('./tree.html').default
// import {Store} from 'vuex';
@injectable()
export class Tree3Creator implements ITree3Creator {
    private store: Store<any>
    // private userId: string

    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    // TODO: will this constructor need userId as an arg?
    constructor(@inject(TYPES.Tree3CreatorArgs){
         /*userId,*/ store
    }: Tree3CreatorArgs ) {
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
                x: String, // Am I doing this right? should I be giving it a class of Number??
                y: String, // Am I doing this right? should I be giving it a class of Number??
                parentId: String,
                contentUserId: String,
                contentId: String,
                userId: String,
                contentString: String,
                contentUserDataString: String,
            },
            async created() {
                log('tree component created',
                    this.id, this.parentId, this.contentId, this.userId,
                    this.contentString, this.parentid, this.contentid,
                    'contentUserId', this.contentUserId
                )
                // this.content = JSON.parse(decodeURIComponent(this.content))
                // var me = this;
                // log('tree component content is now', this.content)
                //
                // this.editing = false
                // this.addingChild = false
                // this.nodeBeingDragged = false
                // this.tree = await Trees.get(this.id)
                // this.content = await ContentItems.get(this.tree.contentId)
                // console.log("components/tree.js content is", this.content)
                // this.startTimer()
                // this.tree.sortLeavesByStudiedAndStrength()

            },
            data() {
                return {
                    tree: {}, // this.tree
                    // content: {}, // this.content
                    editing: false,
                    showHistory: false,
                    addingChild: true,
                    user: {},
                    contentUserDataLocal: null,
                    contentUserDataLoaded: false,
                    proficiencyInput: PROFICIENCIES.UNKNOWN,
                }
            },
            watch: {
                // //stop timer when
                // openNodeId(newNodeId, oldNodeId){
                //     if (oldNodeId === this.tree.id && this.tree.id !== newNodeId){
                //         this.content.saveTimer()
                //     } else {
                //     }
                // }
            },
            computed: {
                content() {
                    if (!this.contentString) {
                        return {}
                    }
                    const decoded = decodeURIComponent(this.contentString)
                    log('decoded is ', decoded)
                    // const content
                    const content = JSON.parse(decoded)
                    log('parsed is', content)

                    return content
                },
                contentUserData() {
                    log('ContentUserData updated!')
                    this.contentUserDataLoaded = false
                    if (this.contentUserDataLocal) {
                        log('ContentUserData updated. using contentUserDataLocal!')
                        return this.contentUserDataLocal
                    }
                    if (!this.contentUserDataString) {
                        return {}
                    }
                    const decoded = decodeURIComponent(this.contentUserDataString)
                    log('contentUserData decoded is ', decoded)
                    // const content
                    const contentUserData: IContentUserData = JSON.parse(decoded)
                    log('contentUserData parsed is', contentUserData)

                    this.proficiencyInput = contentUserData.proficiency
                    this.contentUserDataLoaded = true
                    return contentUserData
                },
                // proficiency() {
                //     return this.contentUserData.proficiency || PROFICIENCIES.UNKNOWN
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
                    log('typeIsHeading is ', isHeading, this.content.type, this.tree.contentType)
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
                        // ^^ this.contentUserData.proficiency || PROFICIENCIES.UNKNOWN
                        styles['background-color'] = ProficiencyUtils.getColor(proficiency)
                        if (this.showHistory) {
                            styles['background-color'] = 'black'
                            styles['color'] = 'white'
                        }
                    }
                    // console.log('trees style object is ', styles)
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
                    log('proficiencyClicked', this.proficiency, this.userId, this.contentUserId)
                    log('proficiencyClicked this.proficiency is', this.proficiency, proficiency, this.proficiencyInput)
                    this.proficiencyInput = proficiency
                    const contentUserId = this.contentUserId
                    const timestamp = Date.now()
                    if (!this.contentUserDataLoaded) {
                        const contentUserData = me.store.commit(
                            MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
                            {
                                contentUserId,
                                proficiency,
                                timestamp,
                            }
                        )
                        this.contentUserDataLocal = contentUserData
                        ;this.contentUserData; // trigger update
                        ;this.stringifiedContentUserData; // trigger update
                        this.contentUserDataLoaded = true
                    } else {
                        me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
                            contentUserId,
                            proficiency,
                            timestamp
                        })
                    }
                    // me.store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
                    //     contentUserId: this.contentUserId,
                    //     proficiency, // NOTICE HOW `this` is different from `me`
                    //     timestamp: Date.now()
                    // })
                    //     user.addMutation('interaction', {contentId: this.content.id,
                    // proficiency: this.content.proficiency, timestamp: Date.now()})
                    //     store.commit('itemStudied', this.content.id)
                    //     this.tree.setInactive()
                    //     // stores.commit('closeNode', this.id)
                },
                // unnecessary now that tree chain is composed of categories/headings whose nodes dont have one color
                async syncTreeChainWithUI() {
                    // this.syncGraphWithNode()
                    // let parentId = this.tree.treeData.parentId;
                    // let parent
                    // let num = 1
                    // while (parentId) {
                    //     // syncGraphWithNode(parentId)
                    //     store.commit('syncGraphWithNode', parentId)
                    //     // PubSub.publish('syncGraphWithNode', parentId)
                    //     parent = await Trees.get(parentId)
                    //     parentId = parent.treeData.parentId
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
export class Tree3CreatorArgs {
    @inject(TYPES.BranchesStore) public store: Store<any>
}
