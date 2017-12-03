// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    ISubscribableMutableField,
    ISubscribableMutableStringSet, ISubscribableTree,
    ITreeDataWithoutId,
    IValUpdates,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
class SubscribableTree extends Subscribable<IValUpdates> implements ISubscribableTree {

    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableField<string>;
    public parentId: ISubscribableMutableField<string>;
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
    public startPublishing() {
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.children.onUpdate(boundCallCallbacks)
        this.contentId.onUpdate(boundCallCallbacks)
        this.parentId.onUpdate(boundCallCallbacks)
    }
}

@injectable()
class SubscribableTreeArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.String) public id
    @inject(TYPES.ISubscribableMutableString) public contentId
    @inject(TYPES.ISubscribableMutableString) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
}

export {ISubscribableTree, SubscribableTree, SubscribableTreeArgs}
