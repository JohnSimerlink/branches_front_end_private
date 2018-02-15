import {
    IMutableSubscribablePoint, ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData, ITreeLocationDataFromFirebase
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {SyncableMutableSubscribableTreeLocation} from '../../objects/treeLocation/SyncableMutableSubscribableTreeLocation';
import {isValidTreeLocationDataFromFirebase} from '../../objects/treeLocation/treeLocationValidator';

export class TreeLocationDeserializer {
   public static deserializeFromFirebase(
       {treeLocationDataFromFirebase}: {treeLocationDataFromFirebase: ITreeLocationDataFromFirebase}
       ): ISyncableMutableSubscribableTreeLocation {
       if (!isValidTreeLocationDataFromFirebase(treeLocationDataFromFirebase)) {
           throw new Error(treeLocationDataFromFirebase + ' is not valid treeLocation data from firebase')
       }
       const pointVal = treeLocationDataFromFirebase.point.val // << TODO: Violation of Law of Demeter?
       const point: IMutableSubscribablePoint =
           new MutableSubscribablePoint({...pointVal})
       const treeLocation: ISyncableMutableSubscribableTreeLocation
           = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

       return treeLocation
   }
    public static deserialize(
        {treeLocationData}: {treeLocationData: ITreeLocationData}
    ): ISyncableMutableSubscribableTreeLocation {
        const pointVal = treeLocationData.point // << TODO: Violation of Law of Demeter?
        const point: IMutableSubscribablePoint =
            new MutableSubscribablePoint({...pointVal})
        const treeLocation: ISyncableMutableSubscribableTreeLocation
            = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

        return treeLocation
    }
    public static convertFromFirebaseToData(
        {treeLocationDataFromFirebase}: {treeLocationDataFromFirebase: ITreeLocationDataFromFirebase}
    ): ITreeLocationData {
        if (!isValidTreeLocationDataFromFirebase(treeLocationDataFromFirebase)) {
            throw new Error(treeLocationDataFromFirebase + ' is not valid treeLocation data from firebase')
        }
        const treeLocationData: ITreeLocationData = {
            point: treeLocationDataFromFirebase.point.val
        }
        // const pointVal = treeLocationDataFromFirebase.point.val // << TODO: Violation of Law of Demeter?
        // const point: IMutableSubscribablePoint =
        //     new MutableSubscribablePoint({...pointVal})
        // const treeLocation: ISyncableMutableSubscribableTreeLocation
        //     = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

        return treeLocationData
    }
}
