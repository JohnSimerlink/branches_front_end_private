import {
    IMutableSubscribablePoint, IMutableSubscribableField, ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData, ITreeLocationDataFromFirebase
} from '../../objects/interfaces';
import {MutableSubscribablePoint} from '../../objects/point/MutableSubscribablePoint';
import {SyncableMutableSubscribableTreeLocation} from '../../objects/treeLocation/SyncableMutableSubscribableTreeLocation';
import {isValidTreeLocationDataFromDB} from '../../objects/treeLocation/treeLocationValidator';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';

export class TreeLocationDeserializer {
   public static deserializeFromDB(
       {treeLocationDataFromDB}: {treeLocationDataFromDB: ITreeLocationDataFromFirebase}
       ): ISyncableMutableSubscribableTreeLocation {
       if (!isValidTreeLocationDataFromDB(treeLocationDataFromDB)) {
           throw new Error(treeLocationDataFromDB + ' is not valid treeLocation data from firebase')
       }
       const treeLocationData: ITreeLocationData =
           TreeLocationDeserializer.convertFromDBToData({treeLocationDataFromDB})
       const treeLocation = TreeLocationDeserializer.deserialize({treeLocationData})
       return treeLocation
   }
    public static deserialize(
        {treeLocationData}: {treeLocationData: ITreeLocationData}
    ): ISyncableMutableSubscribableTreeLocation {
        const pointVal = treeLocationData.point // << TODO: Violation of Law of Demeter?
        const point: IMutableSubscribablePoint =
            new MutableSubscribablePoint({...pointVal})
        const level: IMutableSubscribableField<number> = new MutableSubscribableField({field: treeLocationData.level })
        const treeLocation: ISyncableMutableSubscribableTreeLocation
            = new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point, level})

        return treeLocation
    }
    public static convertFromDBToData(
        {treeLocationDataFromDB}: {treeLocationDataFromDB: ITreeLocationDataFromFirebase}
    ): ITreeLocationData {
        if (!isValidTreeLocationDataFromDB(treeLocationDataFromDB)) {
            throw new Error(treeLocationDataFromDB + ' is not valid treeLocation data from firebase')
        }
        const treeLocationData: ITreeLocationData = {
            point: treeLocationDataFromDB.point.val,
            level: treeLocationDataFromDB.level.val,
        }

        return treeLocationData
    }
}
