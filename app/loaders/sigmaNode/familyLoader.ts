import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../../objects/types';
import {
    IFamilyLoader, id,
    IFamilyLoaderCore
} from '../../objects/interfaces';
import {log} from '../../core/log'

@injectable()
export class FamilyLoader implements IFamilyLoader {
    private familyLoaderCore: IFamilyLoaderCore;
    constructor(@inject(TYPES.FamilyLoaderArgs){
        familyLoaderCore
   }: FamilyLoaderArgs) {
        this.familyLoaderCore = familyLoaderCore
    }
    public loadFamilyIfNotLoaded(sigmaId: id) {
        this.familyLoaderCore.loadFamily(sigmaId)
    }
}

@injectable()
export class FamilyLoaderArgs {
    @inject(TYPES.IFamilyLoaderCore) public familyLoaderCore: IFamilyLoaderCore
}
