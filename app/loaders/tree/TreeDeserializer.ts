import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash,
    ISyncableMutableSubscribableTree,
    ITreeData,
    ITreeDataFromDB,
    ITreeDataWithoutId,
} from '../../objects/interfaces';
import {MutableSubscribableStringSet} from '../../objects/set/MutableSubscribableStringSet';
import {SyncableMutableSubscribableTree} from '../../objects/tree/SyncableMutableSubscribableTree';
import {isValidTree} from '../../objects/tree/treeValidator';

export class TreeDeserializer {
   public static deserializeFromDB(
       {treeDataFromDB, treeId}: {treeDataFromDB: ITreeDataFromDB, treeId: string}
       ): ISyncableMutableSubscribableTree {
       const contentId = new MutableSubscribableField<string>({field: treeDataFromDB.contentId.val});
       /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
        // TODO: figure out why DI puts in a bad IUpdatesCallback!
       */
       const parentId = new MutableSubscribableField<string>({field: treeDataFromDB.parentId.val});
       const childrenSet: IHash<boolean> = treeDataFromDB.children && treeDataFromDB.children.val || {};
       const children = new MutableSubscribableStringSet({set: childrenSet});
       const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
           {updatesCallbacks: [], id: treeId, contentId, parentId, children}
           );
       return tree;
   }
    public static deserializeWithoutId(
        {treeDataWithoutId, treeId}: {treeDataWithoutId: ITreeDataWithoutId, treeId: string}
    ): ISyncableMutableSubscribableTree {
        const contentId = new MutableSubscribableField<string>({field: treeDataWithoutId.contentId});
        /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
         // TODO: figure out why DI puts in a bad IUpdatesCallback!
        */
        const parentId = new MutableSubscribableField<string>({field: treeDataWithoutId.parentId});
        const childrenArray: string[] = treeDataWithoutId.children || [];
        const childrenSet: IHash<boolean> = stringArrayToSet(childrenArray);
        const children = new MutableSubscribableStringSet({set: childrenSet});
        const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
            {updatesCallbacks: [], id: treeId, contentId, parentId, children}
        );
        return tree;
    }
    public static deserialize(
        {treeData, treeId}: {treeData: ITreeData, treeId: string}
    ): ISyncableMutableSubscribableTree {
        const contentId = new MutableSubscribableField<string>({field: treeData.contentId});
        /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
         // TODO: figure out why DI puts in a bad IUpdatesCallback!
        */
        const parentId = new MutableSubscribableField<string>({field: treeData.parentId});
        const childrenArray: string[] = treeData.children || [];
        const childrenSet: IHash<boolean> = stringArrayToSet(childrenArray);
        const children = new MutableSubscribableStringSet({set: childrenSet});
        const tree: ISyncableMutableSubscribableTree = new SyncableMutableSubscribableTree(
            {updatesCallbacks: [], id: treeId, contentId, parentId, children}
        );
        return tree;
    }
   public static convertFromDBToData(
       {treeDataFromDB, }: {treeDataFromDB: ITreeDataFromDB, }
   ): ITreeDataWithoutId {
       if (!isValidTree(treeDataFromDB)) {
           throw new Error('Cannot convert from DB to data. Data with val of '
               + JSON.stringify(treeDataFromDB) + ' is invalid!');
       }
       const childrenArray = treeDataFromDB.children && treeDataFromDB.children.val ?
           setToStringArray(treeDataFromDB.children.val) :
           [];
       return {
           parentId: treeDataFromDB.parentId.val,
           children: childrenArray,
           contentId: treeDataFromDB.contentId.val,
       };
   }
}
