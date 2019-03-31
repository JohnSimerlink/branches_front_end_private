import {
	IIdProppedDatedMutation,
	IMutableSubscribableTreeUser,
	IMutableSubscribableTreeUserStore,
	IProppedDatedMutation,
	ISyncableMutableSubscribableTreeUser,
	ITreeUserData,
	TreeUserPropertyMutationTypes,
	TreeUserPropertyNames
} from '../../interfaces';
import {SubscribableTreeUserStore} from './SubscribableTreeUserStore';
import {TreeUserDeserializer} from '../../../loaders/treeUser/TreeUserDeserializer';
import {log} from '../../../../app/core/log';

export class MutableSubscribableTreeUserStore
	extends SubscribableTreeUserStore
	implements IMutableSubscribableTreeUserStore {
	public addAndSubscribeToItemFromData({id, treeUserData}: { id: string; treeUserData: ITreeUserData }):
		ISyncableMutableSubscribableTreeUser {
		const treeUser: ISyncableMutableSubscribableTreeUser =
			TreeUserDeserializer.deserialize({
				treeUserId: id,
				treeUserData
			});
		log('19: MutableSubscribableTreeUserStore addAndSubscribeToItemFromData called!',
			treeUser, ' the storeSource inside of MutableSubscribableTreeUserStore is',
			this.storeSource, ' and that storesource has an id of ', this.storeSource['_id']);
		this.addItem(id, treeUser);
		return treeUser;
	}

	public addMutation(mutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>) {
		// const treeUserId = mutation.id
		// treeUserId && this.stores[treeUserId].addMutation
		// mutation.id

		const id = mutation.id;
		const treeUser: IMutableSubscribableTreeUser
			= this.storeSource.get(id);
		if (!treeUser) {
			throw new RangeError('Couldn\'t find treeUser for treeUserId: ' + id);
		}

		const proppedDatedMutation:
			IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
			data: mutation.data,
			propertyName: mutation.propertyName,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		treeUser.addMutation(proppedDatedMutation);
		// throw new Error("Method not implemented.");
	}

	public mutations(): Array<IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
		throw new Error('Not implemented!');
	}
}
