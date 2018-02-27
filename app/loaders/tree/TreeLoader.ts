import * as firebase from 'firebase';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    id,
    ISubscribableTreeStoreSource, ISyncableMutableSubscribableTree,
    ITreeDataFromDB,
    ITreeDataWithoutId,
    ITreeLoader
} from '../../objects/interfaces';
import {isValidTree} from '../../objects/tree/treeValidator';
import Reference = firebase.database.Reference;
import {TYPES} from '../../objects/types';
import {TreeDeserializer} from './TreeDeserializer';
import {TAGS} from '../../objects/tags';

@injectable()
export class TreeLoader implements ITreeLoader {
    private storeSource: ISubscribableTreeStoreSource
    private firebaseRef: Reference
    constructor(@inject(TYPES.TreeLoaderArgs){firebaseRef, storeSource}: TreeLoaderArgs) {
        this.storeSource = storeSource
        this.firebaseRef = firebaseRef
    }

    public getData(treeId: id): ITreeDataWithoutId {
        const tree = this.storeSource.get(treeId)
        if (!tree) {
            throw new RangeError(treeId + ' does not exist in TreeLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return tree.val()
        // TODO: fix violoation of law of demeter
    }

    public getItem(treeId: id): ISyncableMutableSubscribableTree {
        const tree = this.storeSource.get(treeId)
        if (!tree) {
            throw new RangeError(treeId + ' does not exist in TreeLoader storeSource. Use isLoaded(treeId) to check.')
        }
        return tree
    }

    // TODO: this method violates SRP.
    // it returns data AND has the side effect of storing the data in the storeSource
    public async downloadData(treeId: id): Promise<ITreeDataWithoutId> {
        const me = this
        return new Promise((resolve, reject) => {
            this.firebaseRef.child(treeId).once('value', (snapshot) => {
                const treeData: ITreeDataFromDB = snapshot.val()
                if (!treeData) {
                    return
                    /* return without resolving promise. The .on('value') triggers an event which
                     resolves with a snapshot right away.
                     Often this first snapshot is null, if firebase hasn't called the network yet,
                     or if the FirebaseMock hasn't flushed a mocked a fake event yet
                     Therefore we just return without resolving,
                     as the promise will actually get resolved in ideally a few more (dozen) milliseconds
                    */
                }
                // let children = treeDataFromDB.children || {}
                // children = setToStringArray(children)
                // treeDataFromDB.children = children as string[]

                if (isValidTree(treeData)) {
                    const tree: ISyncableMutableSubscribableTree =
                        TreeDeserializer.deserializeFromDB({treeId, treeDataFromDB: treeData})
                    me.storeSource.set(treeId, tree)
                    const convertedData = TreeDeserializer.convertFromDBToData({treeDataFromDB: treeData})
                    resolve(convertedData)
                } else {
                    reject('treeDataFromDB with id of ' + treeId + ' is invalid! ! ' + JSON.stringify(treeData))
                }
            })
        }) as Promise<ITreeDataWithoutId>
        // TODO ^^ Figure out how to do this without casting
    }

    public isLoaded(treeId): boolean {
        return !!this.storeSource.get(treeId)
    }

}

@injectable()
export class TreeLoaderArgs {
    @inject(TYPES.FirebaseReference)
    @tagged(TAGS.TREES_REF, true)
        public firebaseRef: Reference
    @inject(TYPES.ISubscribableTreeStoreSource)
    @tagged(TAGS.MAIN_APP, true)
        public storeSource: ISubscribableTreeStoreSource
}
