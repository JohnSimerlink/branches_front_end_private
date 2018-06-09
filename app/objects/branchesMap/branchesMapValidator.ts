import {IBranchesMapDataFromDB} from '../interfaces';

export function isValidBranchesMapDataFromDB(branchesMapDataFromDB: IBranchesMapDataFromDB) {
	return branchesMapDataFromDB && branchesMapDataFromDB.rootTreeId && branchesMapDataFromDB.rootTreeId.val;
}
