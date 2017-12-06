import {
    AllPropertyMutationTypes, ContentUserPropertyMutationTypes, ContentUserPropertyNames, IGlobalDatedMutation,
    IIdDatedMutation, IIdProppedDatedMutation,
    IMutableSubscribableGlobalStore,
    ObjectTypes, TreeMutationTypes, TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {SubscribableGlobalStore} from './SubscribableGlobalStore';
import {log} from '../../../app/core/log'

class MutableSubscribableGlobalStore extends SubscribableGlobalStore implements IMutableSubscribableGlobalStore {
    constructor({treeStore, contentUserStore, updatesCallbacks}) {
        super({treeStore, contentUserStore, updatesCallbacks})
    }
    public addMutation(mutation: IGlobalDatedMutation<AllPropertyMutationTypes>) {
        switch (mutation.objectType) {
            case ObjectTypes.TREE: {
                let propertyName: TreePropertyNames = mutation.propertyName as TreePropertyNames
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const treeStoreMutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type: mutation.type,
                }
                this.treeStore.addMutation(treeStoreMutation)
                break
            }
            case ObjectTypes.CONTENT_USER: {
                let propertyName: ContentUserPropertyNames = mutation.propertyName as ContentUserPropertyNames
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const contentUserStoreMutation:
                  IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type: mutation.type as ContentUserPropertyMutationTypes, // TODO: why do I need this cast?
                }
                this.contentUserStore.addMutation(contentUserStoreMutation)

                break
            }
        }
    }

    public mutations(): Array<IGlobalDatedMutation<AllPropertyMutationTypes>> {
        throw new Error('Method not implemented.');
    }

}

export {MutableSubscribableGlobalStore}
