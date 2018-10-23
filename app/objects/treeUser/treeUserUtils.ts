import {id} from '../interfaces';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';

export function getTreeId({treeUserId}: { treeUserId: id }) {
	const treeId = treeUserId.substring(0, treeUserId.indexOf(COMBINED_ID_SEPARATOR));
	return treeId;
}

export function getUserId({treeUserId}: { treeUserId: id }) {
	const start = treeUserId.indexOf(COMBINED_ID_SEPARATOR) + COMBINED_ID_SEPARATOR.length;
	const end = treeUserId.length;
	const userId = treeUserId.substring(start, end);
	return userId;
}
