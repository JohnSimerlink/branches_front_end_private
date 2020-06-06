import * as firebase_typings
	from '../../core/firebase_interfaces';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';
import {id} from '../../objects/interfaces';

import * as firebase from 'firebase';
type Reference = firebase.database.Reference;

export function getContentUserId({contentId, userId}: { contentId: id, userId: id }): id {
	return contentId + COMBINED_ID_SEPARATOR + userId;
}

export function getContentId({contentUserId}: { contentUserId: id }): id {
	const contentId = contentUserId.substring(0, contentUserId.indexOf(COMBINED_ID_SEPARATOR));
	return contentId;
}

export function getUserId({contentUserId}: { contentUserId: id }) {
	const start = contentUserId.indexOf(COMBINED_ID_SEPARATOR) + COMBINED_ID_SEPARATOR.length;
	const end = contentUserId.length;
	const userId = contentUserId.substring(start, end);
	return userId;
}

export function getContentUserRef({contentUsersRef, contentId, userId,}: {
	contentUsersRef: Reference, contentId: string, userId: string,
}): Reference {
	const contentUserRef = contentUsersRef.child(contentId).child(userId);
	return contentUserRef;
}
