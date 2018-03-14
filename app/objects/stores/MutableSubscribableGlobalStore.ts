import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log';
import {
    ContentPropertyMutationTypes,
    ContentPropertyNames,
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames,
    GlobalStoreObjectTypes,
    GlobalStorePropertyMutationTypes,
    IContentData,
    ICreateMutation,
    IEditMutation,
    IGlobalMutation,
    IIdProppedDatedMutation,
    IMutableSubscribableContentStore,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore,
    IMutableSubscribableTreeLocationStore,
    IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUserStore,
    ITreeDataWithoutId,
    ITreeLocationData,
    ITypeIdProppedDatedMutation,
    IUpdatesCallback,
    STORE_MUTATION_TYPES,
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames,
    TreePropertyMutationTypes,
    TreePropertyNames,
    TreeUserPropertyMutationTypes,
    TreeUserPropertyNames
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableGlobalStore} from './SubscribableGlobalStore';
import {createContentId} from '../content/contentUtils';
import {createTreeId} from '../tree/TreeUtils';
import {TAGS} from '../tags';

@injectable()
// TODO: the fact that this class changes the types of variables
export class MutableSubscribableGlobalStore extends SubscribableGlobalStore implements IMutableSubscribableGlobalStore {
    private _globalStoreId;
    protected treeStore: IMutableSubscribableTreeStore;
    protected treeUserStore: IMutableSubscribableTreeUserStore;
    protected treeLocationStore: IMutableSubscribableTreeLocationStore;
    protected contentStore: IMutableSubscribableContentStore;
    protected contentUserStore: IMutableSubscribableContentUserStore;
    constructor(@inject(TYPES.MutableSubscribableGlobalStoreArgs){
        treeStore, treeUserStore, treeLocationStore,
        contentUserStore, contentStore, updatesCallbacks
    }: MutableSubscribableGlobalStoreArgs) {
        super({treeStore, treeUserStore, treeLocationStore, contentUserStore, contentStore, updatesCallbacks});
        this._globalStoreId = Math.random();
    }
    private addEditMutation(mutation: IEditMutation<GlobalStorePropertyMutationTypes>) {
        // log('MSGlobalStore addEditMutation called',)
        switch (mutation.objectType) {
            case GlobalStoreObjectTypes.TREE: {
                const propertyName: TreePropertyNames = mutation.propertyName as TreePropertyNames;
                const type: TreePropertyMutationTypes = mutation.type as TreePropertyMutationTypes;
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const treeStoreMutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                };
                this.treeStore.addMutation(treeStoreMutation);
                break;
            }
            case GlobalStoreObjectTypes.TREE_USER: {
                const propertyName: TreeUserPropertyNames = mutation.propertyName as TreeUserPropertyNames;
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const type: TreeUserPropertyMutationTypes = mutation.type as TreeUserPropertyMutationTypes;
                const treeUserStoreMutation:
                    IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                };
                // } as IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>
                // ^^ TODO: figure out why I need this cast but not in the other cases on the switch . . .
                this.treeUserStore.addMutation(treeUserStoreMutation);
                break;
            }
            case GlobalStoreObjectTypes.TREE_LOCATION: {
                const propertyName: TreeLocationPropertyNames = mutation.propertyName as TreeLocationPropertyNames;
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const type: TreeLocationPropertyMutationTypes = mutation.type as TreeLocationPropertyMutationTypes;
                const treeLocationStoreMutation:
                    IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type,
                };
                this.treeLocationStore.addMutation(treeLocationStoreMutation);
                break;
            }
            case GlobalStoreObjectTypes.CONTENT_USER: {
                const propertyName: ContentUserPropertyNames = mutation.propertyName as ContentUserPropertyNames;
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const contentUserStoreMutation:
                    IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type: mutation.type as ContentUserPropertyMutationTypes, // TODO: why do I need this cast?
                };
                this.contentUserStore.addMutation(contentUserStoreMutation);
                break;
            }
            case GlobalStoreObjectTypes.CONTENT: {
                const propertyName: ContentPropertyNames = mutation.propertyName as ContentPropertyNames;
                // ^^^ TODO: figure out better typesafety. This trust the caller + type casting is a bit scary
                const contentStoreMutation:
                    IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
                    data: mutation.data,
                    id: mutation.id,
                    propertyName,
                    timestamp: mutation.timestamp,
                    type: mutation.type as ContentUserPropertyMutationTypes, // TODO: why do I need this cast?
                };
                this.contentStore.addMutation(contentStoreMutation);
                break;
            }
        }
    }
    private addCreateMutation(mutation: ICreateMutation<any>): any /*but preferably id */ {
        switch (mutation.objectType) {
            case GlobalStoreObjectTypes.CONTENT_USER: {
                const id = mutation.id;
                const contentUserData = mutation.data;
                this.contentUserStore.addAndSubscribeToItemFromData({id, contentUserData});
                /* IF all subscriptions are set up . . .
                this should trigger sigmaEventListener / sigmaNode.receiveContent
                 . TODO: make an intgration test for this */
                return id;
            }
            case GlobalStoreObjectTypes.CONTENT: {
                const contentData: IContentData = mutation.data;
                const contentId = createContentId(contentData);
                this.contentStore.addAndSubscribeToItemFromData({id: contentId, contentData});
                return contentId;
            }
            case GlobalStoreObjectTypes.TREE: {
                const treeDataWithoutId: ITreeDataWithoutId = mutation.data;
                const id = createTreeId(treeDataWithoutId);
                this.treeStore.addAndSubscribeToItemFromData({id, treeDataWithoutId});
                return id;
            }
            /* TODO: WE HAVE A LOT OF INTEGRATION TESTS
             TO MAKE SURE ALL THESE CREATION MUTATIONS WORK PROPERLY and STAY PROPERLY WORKING */
            case GlobalStoreObjectTypes.TREE_LOCATION: {
                const treeLocationData: ITreeLocationData = mutation.data;
                const id = mutation.id;
                this.treeLocationStore.addAndSubscribeToItemFromData({id, treeLocationData});
                return treeLocationData;
            }
        }
    }
    public addMutation(mutation: IGlobalMutation): any /* id or something else */ {
        if (mutation.type === STORE_MUTATION_TYPES.CREATE_ITEM) {
            return this.addCreateMutation(mutation);
        } else {
            return this.addEditMutation(mutation);
        }
    }

    public mutations(): Array<ITypeIdProppedDatedMutation<GlobalStorePropertyMutationTypes>> {
        throw new Error('Method not implemented.');
    }
}

@injectable()
export class MutableSubscribableGlobalStoreArgs /* extends SubscribableGlobalStoreArgs */ {
    @inject(TYPES.Array)
        public updatesCallbacks: Array<IUpdatesCallback<any>>;

    @inject(TYPES.IMutableSubscribableTreeStore)
    @tagged(TAGS.AUTO_SAVER, true)
        public treeStore: IMutableSubscribableTreeStore;

    @inject(TYPES.IMutableSubscribableTreeUserStore)
    @tagged(TAGS.AUTO_SAVER, true)
        public treeUserStore: IMutableSubscribableTreeUserStore;

    @inject(TYPES.IMutableSubscribableTreeLocationStore)
    @tagged(TAGS.AUTO_SAVER, true)
        public treeLocationStore: IMutableSubscribableTreeLocationStore;

    @inject(TYPES.IMutableSubscribableContentStore)
    @tagged(TAGS.AUTO_SAVER, true)
        public contentStore: IMutableSubscribableContentStore;

    @inject(TYPES.IMutableSubscribableContentUserStore)
    @tagged(TAGS.OVERDUE_LISTENER, true)
        public contentUserStore: IMutableSubscribableContentUserStore;
}
