// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    id,
    IMutableSubscribableField,
    ISubscribableMutableStringSet, ISubscribableTree,
    ITreeDataWithoutId,
    IValUpdates,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

@injectable()
export class SubscribableTree extends Subscribable<IValUpdates> implements ISubscribableTree {
    // private publishing = false
    // TODO: should the below three objects be private?
    private publishing = false ; // todo: inject this via dependency injection in constructor
    public contentId: IMutableSubscribableField<string>;
    public parentId: IMutableSubscribableField<string>;
    public children: ISubscribableMutableStringSet;
    private id: string;

    public getId() {
        return this.id;
    }
    public val(): ITreeDataWithoutId {
        return {
            children: this.children.val(),
            contentId: this.contentId.val(),
            parentId: this.parentId.val(),
        };
    }
    constructor(@inject(TYPES.SubscribableTreeArgs) {
        updatesCallbacks, id, contentId,
        parentId, children
    }: SubscribableTreeArgs ) {
        super({updatesCallbacks});
        this.id = id;
        this.contentId = contentId;
        this.parentId = parentId;
        this.children = children;
    }
    protected callbackArguments(): IValUpdates {
        return this.val();
    }
    public startPublishing() {
        if (this.publishing) {
            return;
        }
        this.publishing = true;
        const boundCallCallbacks = this.callCallbacks.bind(this);
        this.children.onUpdate(boundCallCallbacks);
        this.contentId.onUpdate(boundCallCallbacks);
        this.parentId.onUpdate(boundCallCallbacks);
    }
}

@injectable()
export class SubscribableTreeArgs {
    @inject(TYPES.Array) public updatesCallbacks: Function[];
    @inject(TYPES.String) public id: id;
    @inject(TYPES.IMutableSubscribableString) public contentId: IMutableSubscribableField<id>;
    @inject(TYPES.IMutableSubscribableString) public parentId: IMutableSubscribableField<id>;
    @inject(TYPES.ISubscribableMutableStringSet) public children: ISubscribableMutableStringSet;
}
