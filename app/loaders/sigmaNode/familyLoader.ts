import {inject, injectable} from 'inversify';
import {TYPES} from '../../objects/types';
import {id, IFamilyLoader, IFamilyLoaderCore} from '../../objects/interfaces';
import {log} from '../../core/log';

@injectable()
export class FamilyLoader implements IFamilyLoader {
    private familyLoaderCore: IFamilyLoaderCore;
    constructor(@inject(TYPES.FamilyLoaderArgs){
        familyLoaderCore
   }: FamilyLoaderArgs) {
        this.familyLoaderCore = familyLoaderCore;
    }
    public loadFamilyIfNotLoaded(sigmaId: id) {
        console.log('loadFamily if not loaded called with ',sigmaId)
        this.familyLoaderCore.loadFamily(sigmaId);
    }
}

@injectable()
export class FamilyLoaderArgs {
    @inject(TYPES.IFamilyLoaderCore) public familyLoaderCore: IFamilyLoaderCore;
}
