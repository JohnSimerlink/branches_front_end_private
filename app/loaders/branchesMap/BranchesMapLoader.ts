import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IBranchesMapData, ISyncableMutableSubscribableBranchesMap, IBranchesMapDataFromDB, IBranchesMap, id,
    IBranchesMapLoader
} from '../../objects/interfaces';
import {isValidBranchesMapDataFromDB} from '../../objects/branchesMap/branchesMapValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {BranchesMapDeserializer} from './BranchesMapDeserializer';
import {TAGS} from '../../objects/tags';

@injectable()
export class BranchesMapLoader implements IBranchesMapLoader {
    private firebaseRef: Reference
    constructor(@inject(TYPES.BranchesMapArgs){firebaseRef}: BranchesMapLoaderArgs) {
        this.firebaseRef = firebaseRef
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadBranchesMap(branchesMapId: id): Promise<ISyncableMutableSubscribableBranchesMap> {
        log('branchesMapLoader download BranchesMap called', branchesMapId)
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(branchesMapId).once('value', (snapshot) => {
                const branchesMapDataFromDB: IBranchesMapDataFromDB = snapshot.val()

                if (isValidBranchesMapDataFromDB(branchesMapDataFromDB)) {
                    const branchesMap: ISyncableMutableSubscribableBranchesMap =
                        BranchesMapDeserializer.deserializeFromDB({branchesMapDataFromDB})
                    resolve(branchesMap)
                } else {
                    reject('branchesMapDataFromDB is invalid! ! ' + JSON.stringify(branchesMapDataFromDB))
                }
            })
        }) as Promise<ISyncableMutableSubscribableBranchesMap>
    }
}

@injectable()
export class BranchesMapLoaderArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.USERS_REF, true) public firebaseRef: Reference
}
