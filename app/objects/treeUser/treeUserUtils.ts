import {id} from '../interfaces';
import {separator} from '../../loaders/contentUser/ContentUserLoaderUtils';

export function getTreeId({treeUserId}: { treeUserId: id }) {
	const treeId = treeUserId.substring(0, treeUserId.indexOf(separator));
	return treeId;
}

export function getUserId({treeUserId}: { treeUserId: id }) {
	const start = treeUserId.indexOf(separator) + separator.length;
	const end = treeUserId.length;
	const userId = treeUserId.substring(start, end);
	return userId;
}
