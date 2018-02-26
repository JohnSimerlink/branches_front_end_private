import {
    ISyncableMutableSubscribableTreeLocation, ITreeLocation, ITreeLocationData,
    ITreeLocationDataFromFirebase
} from '../interfaces';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {MutableSubscribablePoint} from '../point/MutableSubscribablePoint';
import {MutableSubscribableField} from "../field/MutableSubscribableField";
import {SyncableMutableSubscribableTreeLocation} from "./SyncableMutableSubscribableTreeLocation";

export const sampleTreeLocationData1x = 5
export const sampleTreeLocationData1y = 8
export const sampleTreeLocationData1Level = 2
export const sampleTreeLocationDataFromFirebase1: ITreeLocationDataFromFirebase = {
    point: {
        val: {
            x: sampleTreeLocationData1x,
            y: sampleTreeLocationData1y,
        }
    },
    level: {
        val: sampleTreeLocationData1Level
    }
}
export const sampleTreeLocationData1: ITreeLocationData = {
    point: {
        x: sampleTreeLocationData1x,
        y: sampleTreeLocationData1y,
    },
    level: sampleTreeLocationData1Level
}
export function getASampleTreeLocation1() {
    const pointVal = sampleTreeLocationData1.point
    const levelVal = sampleTreeLocationData1.level
    const point = new MutableSubscribablePoint({...pointVal})
    const level = new MutableSubscribableField<number>({field: levelVal})
    const treeLocation1: ISyncableMutableSubscribableTreeLocation = new SyncableMutableSubscribableTreeLocation({
        updatesCallbacks: [],
        point,
        level
    })
    return treeLocation1
}
