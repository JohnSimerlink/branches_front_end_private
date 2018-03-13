import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    IMutableSubscribableTreeUser, ISubscribableStoreSource, ISubscribableTreeUserStoreSource,
    ISyncableMutableSubscribableTreeUser, ITreeUserData,
    ITreeUserLoader
} from '../../objects/interfaces';
import {isValidTreeUser} from '../../objects/treeUser/treeUserValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {TreeUserDeserializer} from './TreeUserDeserializer';
import {setToStringArray} from '../../core/newUtils';
import {TAGS} from '../../objects/tags';

export function getTreeUserId({treeId, userId}) {
    const separator = '__';
    return treeId + separator + userId
}
@injectable()
export class TreeUserLoader implements ITreeUserLoader {
    private storeSource: ISubscribableTreeUserStoreSource;
    private firebaseRef: Reference;
    constructor(@inject(TYPES.TreeUserLoaderArgs){firebaseRef, storeSource}: TreeUserLoaderArgs) {
        this.storeSource = storeSource;
        this.firebaseRef = firebaseRef
    }

    public getData({treeId, userId}): ITreeUserData {
        const treeUserId = getTreeUserId({treeId, userId});
        if (!this.storeSource.get(treeUserId)) {
            throw new RangeError(treeUserId +
                ' does not exist in TreeUserLoader storeSource. Use isLoaded(treeUserId) to check.')
        }
        return this.storeSource.get(treeUserId).val()
        // TODO: fix violoation of law of demeter
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData({treeId, userId}): Promise<ITreeUserData> {
        const treeUserId = getTreeUserId({treeId, userId});
        log('treeUserLoader downloadData called');
        const me = this;
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(treeUserId).once('value', (snapshot) => {
                log('treeUserLoader data received');
                const treeUserData: ITreeUserData = snapshot.val();
                if (!treeUserData) {
                    return
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                      or if the FirebaseMock hasn't flushed a mocked a fake event yet
                      Therefore we just return without resolving,
                       as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                       */
                }
                // let children = treeUserData.children || {}
                // children = setToStringArray(children)
                // treeUserData.children = children as string[]

                if (isValidTreeUser(treeUserData)) {
                    const treeUser: ISyncableMutableSubscribableTreeUser =
                        TreeUserDeserializer.deserialize({treeUserId, treeUserData});
                    me.storeSource.set(treeUserId, treeUser);
                    resolve(treeUserData)
                } else {
                    reject('treeUserData is invalid! ! ' + JSON.stringify(treeUserData))
                }
            })
        }) as Promise<ITreeUserData>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded({treeId, userId}): boolean {
        const treeUserId = getTreeUserId({treeId, userId});
        return !!this.storeSource.get(treeUserId)
    }

}

@injectable()
export class TreeUserLoaderArgs {
    @inject(TYPES.FirebaseReference) @tagged(TAGS.TREE_USERS_REF, true) public firebaseRef: Reference;
    @inject(TYPES.ISubscribableTreeUserStoreSource) public storeSource: ISubscribableTreeUserStoreSource
}
