import {
     IMutableSubscribableTreeLocation, ISubscribableUndoableMutablePoint,
    ITreeLocationData
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../objects/treeLocation/MutableSubscribableTreeLocation';

class TreeLocationDeserializer {
   public static deserialize(
       {treeLocationData}: {treeLocationData: ITreeLocationData}
       ): IMutableSubscribableTreeLocation {
       const point: ISubscribableUndoableMutablePoint =
           new MutableSubscribablePoint({...treeLocationData.point})
       const treeLocation: IMutableSubscribableTreeLocation
           = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

       return treeLocation
   }
}
export {TreeLocationDeserializer}
