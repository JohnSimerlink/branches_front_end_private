import {log} from '../../../core/log';
import {
	ContentUserPropertyMutationTypes,
	ContentUserPropertyNames,
	IContentUserData,
	IIdProppedDatedMutation,
	IMutableSubscribableContentUser,
	IMutableSubscribableContentUserStore,
	IProppedDatedMutation,
	ISyncableMutableSubscribableContentUser,
} from '../../interfaces';
import {SubscribableContentUserStore} from './SubscribableContentUserStore';
import {ContentUserDeserializer} from '../../../loaders/contentUser/ContentUserDeserializer';

export class MutableSubscribableContentUserStore extends SubscribableContentUserStore
	implements IMutableSubscribableContentUserStore {
	// TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
	// ^^ TODO: Not sure if above TODO is relevant any more
	public addAndSubscribeToItemFromData(
		{id, contentUserData}:
			{ id: string; contentUserData: IContentUserData; }): ISyncableMutableSubscribableContentUser {
		const contentUser: ISyncableMutableSubscribableContentUser =
			ContentUserDeserializer.deserialize({id, contentUserData});
		this.addItem(id, contentUser);
		return contentUser;
	}

	public addMutation(
		mutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>
	) {
		// TODO: what to do if object does not exist in storeSource
		const id = mutation.id;
		const contentUser: IMutableSubscribableContentUser
			= this.storeSource.get(id);
		if (!contentUser) {
			throw new RangeError('Couldn\'t find contentuser for contentUserId' + id);
		}

		const proppedDatedMutation:
			IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
			data: mutation.data,
			propertyName: mutation.propertyName,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		contentUser.addMutation(proppedDatedMutation);
		// throw new Error("Method not implemented.");
	}

	public mutations(): Array<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
		// return [] as Array<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>>
		throw new Error('Not Implemented');
	}
}
