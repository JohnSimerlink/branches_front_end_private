import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {IHash, IMutableSubscribableTree, ITreeDataFromFirebase, ITreeDataWithoutId} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../objects/tree/MutableSubscribableTree';

class TreeDeserializer {
   public static deserialize(
       {treeData, treeId}: {treeData: ITreeDataFromFirebase, treeId: string}
       ): IMutableSubscribableTree {
       const contentId = new SubscribableMutableField<string>({field: treeData.contentId})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
       */
       const parentId = new SubscribableMutableField<string>({field: treeData.parentId})
       const childrenSet: IHash<boolean> = treeData.children
       const children = new SubscribableMutableStringSet({set: childrenSet})
       const tree: IMutableSubscribableTree = new MutableSubscribableTree(
           {updatesCallbacks: [], id: treeId, contentId, parentId, children}
           )
       return tree
   }
   public static convertSetsToArrays(
       {treeData, }: {treeData: ITreeDataFromFirebase, }
   ): ITreeDataWithoutId {
       const childrenArray = setToStringArray(treeData.children)
       return {
           parentId: treeData.parentId,
           children: childrenArray,
           contentId: treeData.contentId,
       }
   }
}
export {TreeDeserializer}
