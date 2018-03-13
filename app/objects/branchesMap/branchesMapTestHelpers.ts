import {
    ISyncableMutableSubscribableBranchesMap, IBranchesMapData, IBranchesMapDataFromDB, timestamp,
    id
} from '../interfaces';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableBranchesMap} from './SyncableMutableSubscribableBranchesMap';

export const sampleBranchesMapData1RootTreeId: id = '1209abedfegha123';

export const sampleBranchesMapData1: IBranchesMapData = {
    rootTreeId: sampleBranchesMapData1RootTreeId,
};

export const sampleBranchesMapDataFromDB1: IBranchesMapDataFromDB = {
    rootTreeId: {
        val: sampleBranchesMapData1RootTreeId,
    },
};

export const sampleBranchesMap1RootTreeId = new MutableSubscribableField<id>({field: sampleBranchesMapData1RootTreeId});
export const sampleBranchesMap1: ISyncableMutableSubscribableBranchesMap = new SyncableMutableSubscribableBranchesMap(
    {updatesCallbacks: [], rootTreeId: sampleBranchesMap1RootTreeId}
);
