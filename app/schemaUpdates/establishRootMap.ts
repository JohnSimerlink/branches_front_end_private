import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom();
import {branchesMapsRef} from '../../inversify.config';
import {IBranchesMapData, IBranchesMapDataFromDB} from '../objects/interfaces';
import {GLOBAL_MAP_ID, GLOBAL_MAP_ROOT_TREE_ID} from '../core/globals';

// const update
const rootBranchesMap: IBranchesMapDataFromDB = {
    rootTreeId: {
        val: GLOBAL_MAP_ROOT_TREE_ID
    }
};
branchesMapsRef.child(GLOBAL_MAP_ID).update(
    rootBranchesMap
);
