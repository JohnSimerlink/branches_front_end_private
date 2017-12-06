import {log} from '../../../app/core/log'
import {
    AllPropertyMutationTypes, ContentPropertyMutationTypes, ContentPropertyNames, ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, IGlobalDatedMutation,
    IIdDatedMutation,
    IIdProppedDatedMutation, IMutableSubscribableGlobalStore, ObjectTypes, TreePropertyMutationTypes,
    TreePropertyNames, TreeUserPropertyMutationTypes, TreeUserPropertyNames
} from '../interfaces';
import {SubscribableGlobalStore} from './SubscribableGlobalStore';

class MutableSubscribableGlobalStore extends SubscribableGlobalStore implements IMutableSubscribableGlobalStore {
    constructor({treeStore, treeUserStore, contentUserStore, contentStore, updatesCallbacks}) {
        super({treeStore, treeUserStore, contentUserStore, contentStore, updatesCallbacks})
    }
    public addMutation(mutation: IGlobalDatedMutation<AllPropertyMutationTypes>) {
        switch (mutation.objectType) {
            case ObjectTypes.TREE: {
                const propertyName: TreePropertyNames = mutation.propertyName as TreePropertyNames
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
            case ObjectTypes.TREE_USER: {
                // const propertyName: TreeUserPropertyNames = mutation.propertyName as TreeUserPropertyNames
                // // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                // const treeUserStoreMutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
                //     data: mutation.data,
                //     id: mutation.id,
                //     propertyName,
                //     timestamp: mutation.timestamp,
                //     type: mutation.type,
                // }
                // this.treeUserStore.addMutation(treeUserStoreMutation)
                break
            }
            case ObjectTypes.CONTENT_USER: {
                const propertyName: ContentUserPropertyNames = mutation.propertyName as ContentUserPropertyNames
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
            case ObjectTypes.CONTENT: {
                const propertyName: ContentPropertyNames = mutation.propertyName as ContentPropertyNames
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const contentStoreMutation:
                    IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type: mutation.type as ContentUserPropertyMutationTypes, // TODO: why do I need this cast?
                }
                this.contentStore.addMutation(contentStoreMutation)
                break
            }
        }
    }

    public mutations(): Array<IGlobalDatedMutation<AllPropertyMutationTypes>> {
        throw new Error('Method not implemented.');
    }

}

export {MutableSubscribableGlobalStore}
