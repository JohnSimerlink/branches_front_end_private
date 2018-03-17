import {
    ICoordinate,
    id,
    IMutableSubscribableField,
    IMutableSubscribablePoint,
    ISyncableMutableSubscribableTreeLocation,
    ITreeLocationData,
    ITreeLocationDataFromFirebase
} from '../interfaces';
import {MutableSubscribablePoint} from '../point/MutableSubscribablePoint';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableTreeLocation} from './SyncableMutableSubscribableTreeLocation';

export const sampleTreeLocationData1x: number = 5;
export const sampleTreeLocationData1y: number = 8;
export const sampleTreeLocationData1Point: ICoordinate = {
    x: sampleTreeLocationData1x,
    y: sampleTreeLocationData1y,
};
export const sampleTreeLocationData1Level: number = 2;
export const sampleTreeLocationData1MapId: id = '1324abac2';
export const sampleTreeLocationDataFromFirebase1: ITreeLocationDataFromFirebase = {
    point: {
        val: sampleTreeLocationData1Point
    },
    level: {
        val: sampleTreeLocationData1Level
    },
    mapId: {
        val: sampleTreeLocationData1MapId
    }
};
export const sampleTreeLocationData1: ITreeLocationData = {
    point: sampleTreeLocationData1Point,
    level: sampleTreeLocationData1Level,
    mapId: sampleTreeLocationData1MapId
};
export const sampleTreeLocation1Point: IMutableSubscribablePoint
    = new MutableSubscribablePoint({updatesCallbacks: [], ...sampleTreeLocationData1Point});
export const sampleTreeLocation1Level: IMutableSubscribableField<number>
    = new MutableSubscribableField<number>({field: sampleTreeLocationData1Level});
export const sampleTreeLocation1MapId: IMutableSubscribableField<id>
    = new MutableSubscribableField<id>({field: sampleTreeLocationData1MapId});

export function getASampleTreeLocation1() {
    const pointVal = sampleTreeLocationData1.point;
    const levelVal = sampleTreeLocationData1.level;
    const point = new MutableSubscribablePoint({...pointVal});
    const level = new MutableSubscribableField<number>({field: levelVal});
    const mapId = new MutableSubscribableField<string>({field: levelVal});
    const treeLocation1: ISyncableMutableSubscribableTreeLocation = new SyncableMutableSubscribableTreeLocation({
        updatesCallbacks: [],
        point,
        level,
        mapId,
    });
    return treeLocation1;
}
