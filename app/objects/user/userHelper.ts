import * as firebase
	from 'firebase';

export function getUserInfoFromEmailLoginResult(result): firebase.UserInfo {
	const userInfo: firebase.UserInfo = {
		email: result.email,
		displayName: result.displayName || 'Firstname Lastname',
		phoneNumber: result.phoneNumber || null,
		uid: result.uid,
		photoURL: result.photoURL || null,
		providerId: result.providerId || 'password'
	}
	return userInfo
}