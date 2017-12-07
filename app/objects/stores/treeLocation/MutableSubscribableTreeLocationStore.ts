import {
    ContentLocationPropertyMutationTypes, ContentLocationPropertyNames,
    IIdDatedMutation, IIdProppedDatedMutation, IMutableSubscribableContentLocation, IMutableSubscribableTreeLocation,
    IMutableSubscribableTreeLocationStore,
    IProppedDatedMutation,
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames
} from '../../interfaces';
import {SubscribableTreeLocationStore} from './SubscribableTreeLocationStore';

class MutableSubscribableTreeLocationStore
    extends SubscribableTreeLocationStore
    implements IMutableSubscribableTreeLocationStore {
    public addMutation(    mutation: IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>) {
        // const treeLocationId = mutation.id
        // treeLocationId && this.stores[treeLocationId].addMutation
        // mutation.id

        const id = mutation.id
        const treeLocation: IMutableSubscribableTreeLocation
            = this.store[id]
        if (!treeLocation) {
            throw new RangeError('Couldn\'t find treeLocation for treeLocationId: ' + id)
        }

        const proppedDatedMutation:
            IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            data: mutation.data,
            propertyName: mutation.propertyName,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        treeLocation.addMutation(proppedDatedMutation)
        // throw new Error("Method not implemented.");
    }

    public mutations(): Array<IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {
        throw new Error('Not implemented!')
    }
}

export {MutableSubscribableTreeLocationStore}
