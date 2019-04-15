// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	FieldMutationTypes,
	IDatedMutation,
	IMutableSubscribableUser,
	IProppedDatedMutation,
	UserPropertyMutationTypes,
	UserPropertyNames
} from '../interfaces';
import {TYPES} from '../types';
import {
	SubscribableUser,
	SubscribableUserArgs
} from './SubscribableUser';
import * as firebase
	from 'firebase';

@injectable()
export class MutableSubscribableUser extends SubscribableUser implements IMutableSubscribableUser {

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.SubscribableUserArgs) {
		updatesCallbacks,
		membershipExpirationDate,
		everActivatedMembership,
		points,
		rootMapId,
		openMapId,
		currentHoveredTreeId,
		userInfo,
		stripeId,
		stripeSubscriptionId
	}: SubscribableUserArgs) {
		super({
			updatesCallbacks,
			membershipExpirationDate,
			everActivatedMembership,
			points,
			rootMapId,
			openMapId,
			currentHoveredTreeId,
			userInfo,
			stripeId,
			stripeSubscriptionId
		});
	}

	public addMutation(mutation: IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames>
										 // TODO: this lack of typesafety between propertyName and MutationType is concerning
	): void {
		const propertyName: UserPropertyNames = mutation.propertyName;
		const propertyMutation: IDatedMutation<UserPropertyMutationTypes> = {
			data: mutation.data,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		switch (propertyName) {
			case UserPropertyNames.MEMBERSHIP_EXPIRATION_DATE:
				this.membershipExpirationDate.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case UserPropertyNames.EVER_ACTIVATED_MEMBERSHIP:
				this.everActivatedMembership.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case UserPropertyNames.POINTS:
				this.points.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;

			case UserPropertyNames.ROOT_MAP_ID:
				this.rootMapId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case UserPropertyNames.OPEN_MAP_ID:
				this.openMapId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case UserPropertyNames.CURRENT_HOVERED_TREE_ID:
				this.currentHoveredTreeId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case UserPropertyNames.USER_INFO:
				const userInfoObject = mutation.data;
				const userInfo: firebase.UserInfo = {
					displayName: userInfoObject.displayName,
					email: userInfoObject.email,
					phoneNumber: userInfoObject.phoneNumber,
					providerId: userInfoObject.providerId,
					photoURL: userInfoObject.photoURL,
					uid: userInfoObject.uid,
				};
				propertyMutation.data = userInfo;
				// ^ ensures there aren't any extraneous functions
				// or properties on the object being passed in to the SET mutation
				this.userInfo.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			default:
				throw new TypeError(
					propertyName + JSON.stringify(mutation)
					+ ' does not exist as a property. The allowed propertyNames are '
					+ UserPropertyNames);
		}
	}

	public mutations(): Array<IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames>> {
		throw new Error('Not Implemented!');
	}
}
