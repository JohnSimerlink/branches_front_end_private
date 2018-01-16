import {inject, injectable} from 'inversify';
import {TYPES} from '../../objects/types';
import {ISampleComponentCreator, IVuexStore} from '../../objects/interfaces';
import {Store} from 'vuex';
import BranchesStore from '../../core/store2';

@injectable()
export class SampleComponentCreator implements ISampleComponentCreator {
    private store: Store<any>
    constructor(@inject(TYPES.SampleComponentCreatorArgs){store}) {
        this.store = store
    }
    public create() {
    }
}
@injectable()
export class SampleComponentCreatorArgs {
    @inject(TYPES.BranchesStore) public store: BranchesStore
    // @inject(TYPES.String) public store
}
