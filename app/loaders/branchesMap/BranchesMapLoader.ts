import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log';
import {
    IBranchesMapLoader,
    IBranchesMapLoaderCore,
    id,
    IHash,
    ISyncableMutableSubscribableBranchesMap,
} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';

@injectable()
export class BranchesMapLoader implements IBranchesMapLoader {
    private branchesMapLoaderCore: IBranchesMapLoaderCore;
    private branchesMapIdObjectPromiseMap: IHash<Promise<ISyncableMutableSubscribableBranchesMap>>;
    private branchesMapIdObjectMap: IHash<ISyncableMutableSubscribableBranchesMap>;
    constructor(@inject(TYPES.BranchesMapLoaderArgs){
        branchesMapLoaderCore,
        branchesMapIdObjectPromiseMap,
        branchesMapIdObjectMap,
    }: BranchesMapLoaderArgs) {
        this.branchesMapLoaderCore = branchesMapLoaderCore;
        this.branchesMapIdObjectPromiseMap = branchesMapIdObjectPromiseMap;
        this.branchesMapIdObjectMap = branchesMapIdObjectMap;
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async loadIfNotLoaded(branchesMapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {

        // check if data is in cache
        const branchesMap: ISyncableMutableSubscribableBranchesMap
            = this.branchesMapIdObjectMap[branchesMapId];
        if (branchesMap) {
            return branchesMap;
        }
        // check if data is currently being fetched by another instance of this method
        const storedObjectPromise: Promise<ISyncableMutableSubscribableBranchesMap> =
            this.branchesMapIdObjectPromiseMap[branchesMapId];
        if (storedObjectPromise) {
            return await storedObjectPromise;
        }
        // else load the data
        const dataPromise = this.branchesMapLoaderCore.load(branchesMapId);
        this.branchesMapIdObjectPromiseMap[branchesMapId] = dataPromise;

        const data = await dataPromise;
        this.branchesMapIdObjectMap[branchesMapId] = data;
        delete this.branchesMapIdObjectPromiseMap[branchesMapId];
        return dataPromise;

    }
}

@injectable()
export class BranchesMapLoaderArgs {
    @inject(TYPES.IBranchesMapLoaderCore) public branchesMapLoaderCore: IBranchesMapLoaderCore;
    @inject(TYPES.Object)
        private branchesMapIdObjectPromiseMap: IHash<Promise<ISyncableMutableSubscribableBranchesMap>>;
    @inject(TYPES.Object)
        private branchesMapIdObjectMap: IHash<ISyncableMutableSubscribableBranchesMap>;
}
