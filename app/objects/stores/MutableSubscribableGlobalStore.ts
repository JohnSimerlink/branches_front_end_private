import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    AllPropertyMutationTypes, ContentPropertyMutationTypes, ContentPropertyNames, ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, IGlobalDatedMutation,
    IIdProppedDatedMutation, IMutableSubscribableGlobalStore, ObjectTypes, TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames, TreePropertyMutationTypes, TreePropertyNames, TreeUserPropertyMutationTypes,
    TreeUserPropertyNames
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableGlobalStore} from './SubscribableGlobalStore';

@injectable()
class MutableSubscribableGlobalStore extends SubscribableGlobalStore implements IMutableSubscribableGlobalStore {
    constructor(@inject(TYPES.SubscribableGlobalStoreArgs){
        treeStore, treeUserStore, treeLocationStore,
        contentUserStore, contentStore, updatesCallbacks
    }) {
        super({treeStore, treeUserStore, treeLocationStore, contentUserStore, contentStore, updatesCallbacks})
    }
    public addMutation(mutation: IGlobalDatedMutation<AllPropertyMutationTypes>) {
        switch (mutation.objectType) {
            case ObjectTypes.TREE: {
                const propertyName: TreePropertyNames = mutation.propertyName as TreePropertyNames
                const type: TreePropertyMutationTypes = mutation.type as TreePropertyMutationTypes
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const treeStoreMutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                }
                this.treeStore.addMutation(treeStoreMutation)
                break
            }
            case ObjectTypes.TREE_USER: {
                const propertyName: TreeUserPropertyNames = mutation.propertyName as TreeUserPropertyNames
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const type: TreeUserPropertyMutationTypes = mutation.type as TreeUserPropertyMutationTypes
                const treeUserStoreMutation:
                    IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                }
                // } as IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>
                // ^^ TODO: figure out why I need this cast but not in the other cases on the switch . . .
                this.treeUserStore.addMutation(treeUserStoreMutation)
                break
            }
            case ObjectTypes.TREE_LOCATION: {
                const propertyName: TreeLocationPropertyNames = mutation.propertyName as TreeLocationPropertyNames
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const type: TreeLocationPropertyMutationTypes = mutation.type as TreeLocationPropertyMutationTypes
                const treeLocationStoreMutation:
                    IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                }
                this.treeLocationStore.addMutation(treeLocationStoreMutation)
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
    public callCallbacks() {
        super.callCallbacks()
    }

    public mutations(): Array<IGlobalDatedMutation<AllPropertyMutationTypes>> {
        throw new Error('Method not implemented.');
    }

}

@injectable()
class MutableSubscribableGlobalStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.IMutableSubscribableTreeStore) public treeStore
    @inject(TYPES.IMutableSubscribableTreeUserStore) public treeUserStore
    @inject(TYPES.IMutableSubscribableTreeLocationStore) public treeLocationStore
    @inject(TYPES.IMutableSubscribableContentStore) public contentStore
    @inject(TYPES.IMutableSubscribableContentUserStore) public contentUserStore
}
export {MutableSubscribableGlobalStore, MutableSubscribableGlobalStoreArgs}
