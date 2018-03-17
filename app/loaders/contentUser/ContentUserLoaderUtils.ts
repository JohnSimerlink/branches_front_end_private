import * as firebase from 'firebase';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';
import {id} from '../../objects/interfaces';
import Reference = firebase.database.Reference;

export const separator = COMBINED_ID_SEPARATOR;
export function getContentUserId({contentId, userId}: {contentId: id, userId: id}): id {
    return contentId + separator + userId;
}
export function getContentId({contentUserId}: {contentUserId: id}): id {
    const contentId = contentUserId.substring(0, contentUserId.indexOf(separator));
    return contentId;
}
export function getUserId({contentUserId}: {contentUserId: id}) {
    const start = contentUserId.indexOf(separator) + separator.length;
    const end = contentUserId.length;
    const userId = contentUserId.substring(start, end);
    return userId;
}
export function getContentUserRef({contentUsersRef, contentId, userId, }: {
    contentUsersRef: Reference, contentId: string, userId: string,
}): Reference {
    const contentUserRef = contentUsersRef.child(contentId).child(userId);
    return contentUserRef;
}
