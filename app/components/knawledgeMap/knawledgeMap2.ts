// import template from './views/knawledgeMap.html'
// import register from 'ignore-styles'
import {inject, injectable, tagged} from 'inversify';
import 'reflect-metadata'
import {Store} from 'vuex';
import {log} from '../../../app/core/log'
import {ANOTHER_CONTENT_ID, ANOTHER_ID, INITIAL_ID_TO_DOWNLOAD, ROOT_CONTENT_ID} from '../../core/globals';
import {default as BranchesStore, MUTATION_NAMES} from '../../core/store2';
import {
    IContentLoader, IContentUserLoader, IVueComponentCreator, ITree, ITreeLoader, ITreeLocationLoader,
    IVuexStore, IKnawledgeMapCreator, id
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles').default
    register(['.html', '.less'])
}
import './knawledgeMap.less'
import {TAGS} from '../../objects/tags';
// tslint:disable-next-line no-var-requires
const template = require('./knawledgeMap.html').default
// import {Store} from 'vuex';
@injectable()
export class KnawledgeMapCreator implements IKnawledgeMapCreator {
    private specialTreeLoader: ITreeLoader
    private treeLocationLoader: ITreeLocationLoader
    private contentLoader: IContentLoader
    private contentUserLoader: IContentUserLoader
    private store: Store<any>
    private userId: id

    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    constructor(@inject(TYPES.KnawledgeMapCreatorArgs){
        specialTreeLoader, treeLocationLoader, contentLoader, contentUserLoader, userId, store
    }) {
        this.store = store
        this.specialTreeLoader = specialTreeLoader
        this.treeLocationLoader = treeLocationLoader
        this.contentLoader = contentLoader
        this.contentUserLoader = contentUserLoader
        this.userId = userId
    }
    public create() {
        const me = this
        return {
            props: [],
            template,
            mounted() {
                // TODO: Maybe all of these download actions should be done via Vuex Store actions
                me.specialTreeLoader.downloadData(INITIAL_ID_TO_DOWNLOAD)
                me.treeLocationLoader.downloadData(INITIAL_ID_TO_DOWNLOAD)
                me.contentLoader.downloadData(ROOT_CONTENT_ID)
                me.contentUserLoader.downloadData({userId: me.userId, contentId: ROOT_CONTENT_ID})
                me.specialTreeLoader.downloadData(ANOTHER_ID)
                me.treeLocationLoader.downloadData(ANOTHER_ID)
                me.contentLoader.downloadData(ANOTHER_CONTENT_ID)
                me.contentUserLoader.downloadData({userId: me.userId, contentId: ANOTHER_CONTENT_ID})

                const newCategoryId = 'b6f78c9ac8c2d79a97993d8459a7836e'
                const newCategory_Content_id = ''
                me.specialTreeLoader.downloadData(newCategoryId)
                me.treeLocationLoader.downloadData(newCategoryId)

                // TreeLoader.downLoadData(1)
                log('about to initialized sigma')
                me.store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
                // sigmaInstance.initialize()
                // log('kn created')
                // log('container is ' + document.querySelector('#graph-container'))
                // me.initializeSigma()
                // log('sigma just initialized')
                // me.store.commit(MUTATION_NAMES.JUMP_TO, INITIAL_ID_TO_DOWNLOAD)
            },
            computed: {
            },
            watch: {
                $route: 'init',
            },
            methods: {
                init() {
                },
                aMethod() {
                    for (let i = 0; i < 100; i++ ) {
                        log('i ', i)
                    }
                }
            }
        }
    }
}
@injectable()
export class KnawledgeMapCreatorArgs {
    @inject(TYPES.ITreeLoader) public specialTreeLoader: ITreeLoader
    @inject(TYPES.ITreeLocationLoader) @tagged(TAGS.AUTO_SAVER, true) public treeLocationLoader: ITreeLocationLoader
    @inject(TYPES.IContentLoader) @tagged(TAGS.AUTO_SAVER, true) public contentLoader: IContentLoader
    @inject(TYPES.IContentUserLoader) @tagged(TAGS.AUTO_SAVER, true) public contentUserLoader: IContentUserLoader
    @inject(TYPES.BranchesStore) public store: BranchesStore
    @inject(TYPES.Id) public userId: id
}
