import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IBranchesMapData, ISyncableMutableSubscribableBranchesMap, IBranchesMapDataFromDB, IBranchesMap, id,
    IBranchesMapLoader, IBranchesMapLoaderCore, IHash,
} from '../../objects/interfaces';
import {isValidBranchesMapDataFromDB} from '../../objects/branchesMap/branchesMapValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {BranchesMapDeserializer} from './BranchesMapDeserializer';
import {TAGS} from '../../objects/tags';

@injectable()
export class BranchesMapLoader implements IBranchesMapLoader {
    private branchesMapLoaderCore: IBranchesMapLoaderCore
    private branchesMapIdObjectPromiseMap: IHash<Promise<ISyncableMutableSubscribableBranchesMap>>
    private branchesMapIdObjectMap: IHash<ISyncableMutableSubscribableBranchesMap>
    constructor(@inject(TYPES.BranchesMapLoaderArgs){
        branchesMapLoaderCore,
        branchesMapIdObjectPromiseMap,
        branchesMapIdObjectMap,
    }: BranchesMapLoaderArgs) {
        this.branchesMapLoaderCore = branchesMapLoaderCore
        this.branchesMapIdObjectPromiseMap = branchesMapIdObjectPromiseMap
        this.branchesMapIdObjectMap = branchesMapIdObjectMap
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async loadIfNotLoaded(branchesMapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
        log('J14I: BML loadIfNl called', branchesMapId)

        // check if data is in cache
        const branchesMap: ISyncableMutableSubscribableBranchesMap
            = this.branchesMapIdObjectMap[branchesMapId]
        if (branchesMap) {
            return branchesMap
        }
        // check if data is currently being fetched by another instance of this method
        const storedObjectPromise: Promise<ISyncableMutableSubscribableBranchesMap> =
            this.branchesMapIdObjectPromiseMap[branchesMapId]
        if (storedObjectPromise) {
            return await storedObjectPromise
        }
        // else load the data
        const dataPromise = this.branchesMapLoaderCore.load(branchesMapId)
        this.branchesMapIdObjectPromiseMap[branchesMapId] = dataPromise

        const data = await dataPromise
        this.branchesMapIdObjectMap[branchesMapId] = data
        delete this.branchesMapIdObjectPromiseMap[branchesMapId]
        return dataPromise

        // log('branchesMapLoader download BranchesMap called', branchesMapId)
        // return new Promise((resolve, reject) => {
        //     this.firebaseRef.child(branchesMapId).once('value', (snapshot) => {
        //         const branchesMapDataFromDB: IBranchesMapDataFromDB = snapshot.val()
        //
        //         if (isValidBranchesMapDataFromDB(branchesMapDataFromDB)) {
        //             const branchesMap: ISyncableMutableSubscribableBranchesMap =
        //                 BranchesMapDeserializer.deserializeFromDB({branchesMapDataFromDB})
        //             resolve(branchesMap)
        //         } else {
        //             reject('branchesMapDataFromDB is invalid! ! ' + JSON.stringify(branchesMapDataFromDB))
        //         }
        //     })
        // }) as Promise<ISyncableMutableSubscribableBranchesMap>
    }
}

@injectable()
export class BranchesMapLoaderArgs {
    // @inject(TYPES.FirebaseReference)
    // @tagged(TAGS.BRANCHES_MAPS_REF, true)
    //     public firebaseRef: Reference
    @inject(TYPES.IBranchesMapLoaderCore) public branchesMapLoaderCore: IBranchesMapLoaderCore
    @inject(TYPES.Object)
        private branchesMapIdObjectPromiseMap: IHash<Promise<ISyncableMutableSubscribableBranchesMap>>
    @inject(TYPES.Object)
        private branchesMapIdObjectMap: IHash<ISyncableMutableSubscribableBranchesMap>
}
