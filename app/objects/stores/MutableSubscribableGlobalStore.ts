import {inject, injectable} from 'inversify';
import {log} from '../../../app/core/log'
import {
    AllPropertyMutationTypes, ContentPropertyMutationTypes, ContentPropertyNames, ContentUserPropertyMutationTypes,
    ContentUserPropertyNames, ITypeIdProppedDatedMutation,
    IIdProppedDatedMutation, IMutableSubscribableGlobalStore, ObjectTypes, TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames, TreePropertyMutationTypes, TreePropertyNames, TreeUserPropertyMutationTypes,
    TreeUserPropertyNames, IGlobalMutation, ICreateMutation, STORE_MUTATION_TYPES, IContentUserData, IContentData,
    ITreeData, ITreeDataWithoutId
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableGlobalStore} from './SubscribableGlobalStore';
import {createContentId} from '../content/contentUtils';

@injectable()
export class MutableSubscribableGlobalStore extends SubscribableGlobalStore implements IMutableSubscribableGlobalStore {
    constructor(@inject(TYPES.MutableSubscribableGlobalStoreArgs){
        treeStore, treeUserStore, treeLocationStore,
        contentUserStore, contentStore, updatesCallbacks
    }) {
        super({treeStore, treeUserStore, treeLocationStore, contentUserStore, contentStore, updatesCallbacks})
    }
    private addEditMutation(mutation: ITypeIdProppedDatedMutation<AllPropertyMutationTypes>) {
        // log('MSGlobalStore addEditMutation called',)
        switch (mutation.objectType) {
            case ObjectTypes.TREE: {
                // log('MSGlobalStore addEditMutation TREE called', mutation)
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
                // log('this contentUserStore is ', this.contentUserStore, this.contentUserStore.addMutation)
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
    private addCreateMutation(mutation: ICreateMutation<any>) {
        // log('MSGLobalStore addCreateMutation called: 3')
        switch (mutation.objectType) {
            case ObjectTypes.CONTENT_USER: {
                const id = mutation.id
                const contentUserData = mutation.data
                this.contentUserStore.addAndSubscribeToItemFromData({id, contentUserData})
                /* IF all subscriptions are set up . . .
                this should trigger sigmaEventListener / sigmaNode.receiveContent
                 . TODO: make an intgration test for this */
            }
            case ObjectTypes.CONTENT: {
                const contentData: IContentData = mutation.data
                const contentId = createContentId(contentData)
                this.contentStore.addAndSubscribeToItemFromData({id: contentId, contentData})
            }
            case ObjectTypes.TREE: {
                const treeDataWithoutId: ITreeDataWithoutId = mutation.data
                const id = mutation.id
                const treeData: ITreeData = {
                    ...treeDataWithoutId,
                    id
                }
                this.treeStore.addAndSubscribeToItemFromData({id, treeData})
            }
        }
    }
    public addMutation(mutation: IGlobalMutation) {
        // log('MSGLobalStore addMutation called 1', mutation.type, STORE_MUTATION_TYPES.CREATE_ITEM)
        if (mutation.type === STORE_MUTATION_TYPES.CREATE_ITEM) {
            // log('MSGLobalStore addMutation called: about to call addCreateMutation 2 ')
            this.addCreateMutation(mutation)
        } else {
            log('MSGLobalStore addMutation called: about to call addEditMutation 2')
            this.addEditMutation(mutation)
        }
    }
    public callCallbacks() {
        super.callCallbacks()
    }

    public mutations(): Array<ITypeIdProppedDatedMutation<AllPropertyMutationTypes>> {
        throw new Error('Method not implemented.');
    }

}

@injectable()
export class MutableSubscribableGlobalStoreArgs {
    @inject(TYPES.Array) public updatesCallbacks;
    @inject(TYPES.IMutableSubscribableTreeStore) public treeStore
    @inject(TYPES.IMutableSubscribableTreeUserStore) public treeUserStore
    @inject(TYPES.IMutableSubscribableTreeLocationStore) public treeLocationStore
    @inject(TYPES.IMutableSubscribableContentStore) public contentStore
    @inject(TYPES.IMutableSubscribableContentUserStore) public contentUserStore
}
