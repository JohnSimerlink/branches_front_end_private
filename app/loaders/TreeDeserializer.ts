import {stringArrayToSet} from '../core/newUtils';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {IHash, IMutableSubscribableTree, ITreeDataWithoutId} from '../objects/interfaces';
import {SubscribableMutableStringSet} from '../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../objects/tree/MutableSubscribableTree';

class TreeDeserializer {
   public static deserialize(treeData: ITreeDataWithoutId, treeId: string): IMutableSubscribableTree {
       const contentId = new SubscribableMutableField<string>({field: treeData.contentId})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
       */
       const parentId = new SubscribableMutableField<string>({field: treeData.parentId})
       const childrenSet: IHash<boolean> = stringArrayToSet(treeData.children)
       const children = new SubscribableMutableStringSet({set: childrenSet})
       const tree: IMutableSubscribableTree = new MutableSubscribableTree(
           {updatesCallbacks: [], id: treeId, contentId, parentId, children}
           )
       return tree
   }
}
