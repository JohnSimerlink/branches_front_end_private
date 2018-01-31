import {
    IMutableSubscribablePoint, ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {SyncableMutableSubscribableTreeLocation} from '../../objects/treeLocation/SyncableMutableSubscribableTreeLocation';
import {isValidTreeLocationData} from '../../objects/treeLocation/treeLocationValidator';

export class TreeLocationDeserializer {
   public static deserialize(
       {treeLocationData}: {treeLocationData: ITreeLocationData}
       ): ISyncableMutableSubscribableTreeLocation {
       if (!isValidTreeLocationData(treeLocationData)) {
           throw new Error(treeLocationData + ' is not valid treeLocation data')
       }
       const pointVal = treeLocationData.point.val // << TODO: Violation of Law of Demeter?
       const point: IMutableSubscribablePoint =
           new MutableSubscribablePoint({...pointVal})
       const treeLocation: ISyncableMutableSubscribableTreeLocation
           = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

       return treeLocation
   }
}
