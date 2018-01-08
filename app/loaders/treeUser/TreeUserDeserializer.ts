import {setToStringArray, stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IHash, IMutableSubscribableTreeUser, IProficiencyStats, ITreeUserData,
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTreeUser} from '../../objects/treeUser/MutableSubscribableTreeUser';

class TreeUserDeserializer {
   public static deserialize(
       {treeUserData, treeUserId}: {treeUserData: ITreeUserData, treeUserId: string}
       ): IMutableSubscribableTreeUser {

       const proficiencyStatsVal = {
           ONE: 3,
       } as IProficiencyStats
       const aggregationTimerVal = 87

       const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: treeUserData.proficiencyStats})
       const aggregationTimer = new SubscribableMutableField<number>({field: treeUserData.aggregationTimer})

       const treeUser: IMutableSubscribableTreeUser = new MutableSubscribableTreeUser(
           {updatesCallbacks: [], proficiencyStats, aggregationTimer}
           )
       return treeUser
   }
}
export {TreeUserDeserializer}
