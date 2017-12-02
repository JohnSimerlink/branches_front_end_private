// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    ITreeDataWithoutId,
    IDatedMutation,
    IdMutationTypes, IProppedDatedMutation,
    ISubscribableTreeCore,
    ISubscribableMutableId,
    ISubscribableMutableStringSet,
    IValUpdates, SetMutationTypes,
    TreeMutationTypes, TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

interface ISubscribableTree extends SubscribableTree {}

@injectable()
class SubscribableTree extends Subscribable<TreeMutationTypes, IValUpdates> implements ISubscribableTreeCore {

    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableId;
    public parentId: ISubscribableMutableId;
    public children: ISubscribableMutableStringSet;
    private id: string;

    public getId() {
        return this.id
    }
    public val(): ITreeDataWithoutId {
        return {
            children: this.children.val(),
            contentId: this.contentId.val(),
            parentId: this.parentId.val(),
        }
    }
    constructor(@inject(TYPES.SubscribableTreeArgs) {updatesCallbacks, id, contentId, parentId, children}) {
        super({updatesCallbacks})
        this.id = id
        this.contentId = contentId
        this.parentId = parentId
        this.children = children
    }
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public publishUponDescendantUpdates() {
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.children.onUpdate(boundCallCallbacks)
        this.contentId.onUpdate(boundCallCallbacks)
        this.parentId.onUpdate(boundCallCallbacks)
    }

    public addMutation(mutation: IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>
        // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ) {
        const propertyName: TreePropertyNames = mutation.propertyName
        switch (propertyName) {
            case TreePropertyNames.CONTENT_ID:
                this.contentId.addMutation(mutation as IDatedMutation<IdMutationTypes>)
                break;
            case TreePropertyNames.PARENT_ID:
                this.parentId.addMutation(mutation as IDatedMutation<IdMutationTypes>)
                break;
            case TreePropertyNames.CHILDREN:
                this.children.addMutation(mutation as IDatedMutation<SetMutationTypes>)
                break;
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property ')
        }
    }
    // TODO: have this class implement IMutable directly
}

@injectable()
class SubscribableBasicTreeArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.String) public id
    @inject(TYPES.ISubscribableMutableId) public contentId
    @inject(TYPES.ISubscribableMutableId) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
}

export {SubscribableTree, SubscribableBasicTreeArgs, ISubscribableTree}
