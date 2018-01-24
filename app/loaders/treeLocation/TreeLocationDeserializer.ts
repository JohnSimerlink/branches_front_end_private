import {
    IMutableSubscribablePoint, ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {SyncableMutableSubscribableTreeLocation} from '../../objects/treeLocation/SyncableMutableSubscribableTreeLocation';

class TreeLocationDeserializer {
   public static deserialize(
       {treeLocationData}: {treeLocationData: ITreeLocationData}
       ): ISyncableMutableSubscribableTreeLocation {
       const point: IMutableSubscribablePoint =
           new MutableSubscribablePoint({...treeLocationData.point})
       const treeLocation: ISyncableMutableSubscribableTreeLocation
           = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

       return treeLocation
   }
}
export {TreeLocationDeserializer}
