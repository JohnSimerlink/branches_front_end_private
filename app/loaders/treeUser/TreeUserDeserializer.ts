import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {IHash, IMutableSubscribableTreeUser, ITreeUserDataFromFirebase, ITreeUserDataWithoutId} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTreeUser} from '../../objects/treeUser/MutableSubscribableTreeUser';

class TreeUserDeserializer {
   public static deserialize(
       {treeUserData, treeUserId}: {treeUserData: ITreeUserDataFromFirebase, treeUserId: string}
       ): IMutableSubscribableTreeUser {
       const contentId = new SubscribableMutableField<string>({field: treeUserData.contentId})
       /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
       */
       const parentId = new SubscribableMutableField<string>({field: treeUserData.parentId})
       const childrenSet: IHash<boolean> = treeUserData.children
       const children = new SubscribableMutableStringSet({set: childrenSet})
       const treeUser: IMutableSubscribableTreeUser = new MutableSubscribableTreeUser(
           {updatesCallbacks: [], id: treeUserId, contentId, parentId, children}
           )
       return treeUser
   }
   public static convertSetsToArrays(
       {treeUserData, }: {treeUserData: ITreeUserDataFromFirebase, }
   ): ITreeUserDataWithoutId {
       const childrenArray = setToStringArray(treeUserData.children)
       return {
           parentId: treeUserData.parentId,
           children: childrenArray,
           contentId: treeUserData.contentId,
       }
   }
}
export {TreeUserDeserializer}
