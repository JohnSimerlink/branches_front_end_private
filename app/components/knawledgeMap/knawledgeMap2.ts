// import template from './views/knawledgeMap.html'
// import register from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata'
import {Store} from 'vuex';
import {log} from '../../../app/core/log'
import {INITIAL_ID_TO_DOWNLOAD} from '../../core/globals';
import {MUTATION_NAMES} from '../../core/store2';
import {IKnawledgeMapCreator, ITree, ITreeLoader, IVuexStore} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles')
    log('register is ', register)
    register(['.html'])
}
// tslint:disable-next-line no-var-requires
const template = require('./views/knawledgeMap.html').default
log('template is ' + template + JSON.stringify(template))
// import {Store} from 'vuex';
@injectable()
export class KnawledgeMapCreator implements IKnawledgeMapCreator {
    private treeLoader: ITreeLoader
    private store: Store<any>

    constructor(@inject(TYPES.KnawledgeMapCreatorArgs){treeLoader, store}) {
        this.store = store
        this.treeLoader = treeLoader
    }
    public create() {
        const me = this
        return {
            props: [],
            template,
            created() {
                me.treeLoader.downloadData(INITIAL_ID_TO_DOWNLOAD)
                // TreeLoader.downLoadData(1)
                me.store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
                // sigmaInstance.initialize()
                log('kn created')
            },
            computed: {
            },
            watch: {
                $route: 'init',
            },
            methods: {
                init() {
                }
            }
        }
    }
}
@injectable()
export class KnawledgeMapCreatorArgs {
    @inject(TYPES.ITreeLoader) public treeLoader: ITreeLoader
    @inject(TYPES.IVuexStore) public store: IVuexStore
}
