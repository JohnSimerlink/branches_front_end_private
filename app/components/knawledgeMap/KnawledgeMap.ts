// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {Store} from 'vuex';
import {log} from '../../../app/core/log';
import {MUTATION_NAMES} from '../../core/store';
import {IKnawledgeMapCreator, ISigmaNodeLoader, } from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import './knawledgeMap.less';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
    const register = require('ignore-styles').default;
    register(['.html', '.less']);
}
// tslint:disable-next-line no-var-requires
const template = require('./knawledgeMap.html').default;

@injectable()
export class KnawledgeMapCreator implements IKnawledgeMapCreator {
    private sigmaNodeLoader: ISigmaNodeLoader;
    private store: Store<any>;
    constructor(
        @inject(TYPES.KnawledgeMapCreatorArgs)
        {
            sigmaNodeLoader,
            store
        }: KnawledgeMapCreatorArgs) {
        this.sigmaNodeLoader = sigmaNodeLoader;
        this.store = store;
    }
    public create() {
        const me = this;
        return {
            props: ['mapId'],
            template,
            mounted() {
                me.store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);
                me.store.commit(MUTATION_NAMES.SWITCH_TO_LAST_USED_MAP);
            },
            watch: {
                $route: 'init',
            },
            methods: {
                aMethod() {
                    for (let i = 0; i < 100; i++ ) {
                        log('i ', i);
                    }
                }
            }
        };

    }
}

@injectable()
export class KnawledgeMapCreatorArgs {
    @inject(TYPES.ISigmaNodeLoader)
        public sigmaNodeLoader: ISigmaNodeLoader;
    @inject(TYPES.BranchesStore)
        public store: Store<any>;
}
