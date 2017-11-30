// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {IdMutationTypes} from '../id/IdMutationTypes';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {IValUpdates} from '../interfaces';
import {IDatedMutation} from '../mutations/IMutation';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {SetMutationTypes} from '../set/SetMutationTypes';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'
import {IBasicTreeDataWithoutId} from './IBasicTreeData';
import {ISubscribableBasicTreeCore} from './ISubscribableBasicTree';
import {TreeMutationTypes} from './TreeMutationTypes';

interface ISubscribableBasicTree extends SubscribableBasicTree {}

@injectable()
class SubscribableBasicTree extends Subscribable<TreeMutationTypes, any> implements ISubscribableBasicTreeCore {

    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableId;
    public parentId: ISubscribableMutableId;
    public children: ISubscribableMutableStringSet;
    private id: string;

    public getId() {
        return this.id
    }
    public val(): IBasicTreeDataWithoutId {
        return {
            children: this.children.val(),
            contentId: this.contentId.val(),
            parentId: this.parentId.val(),
        }
    }
    constructor(@inject(TYPES.SubscribableBasicTreeArgs) {updatesCallbacks, id, contentId, parentId, children}) {
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

    public addDescendantMutation(
        propertyName: TreePropertyNames,
        mutation: IDatedMutation<SetMutationTypes | IdMutationTypes>
        // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ) {
        switch (propertyName) {
            case 'contentId':
                this.contentId.addMutation(mutation as IDatedMutation<IdMutationTypes>)
                break;
            case 'parentId':
                this.parentId.addMutation(mutation as IDatedMutation<IdMutationTypes>)
                break;
            case 'children':
                this.children.addMutation(mutation as IDatedMutation<SetMutationTypes>)
                break;
            default:
                throw new TypeError(
                    propertyName
                    + ' does not exist as a property ')
        }
    }
}

type TreePropertyNames = 'contentId' | 'parentId' | 'children'
@injectable()
class SubscribableBasicTreeArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.String) public id
    @inject(TYPES.ISubscribableMutableId) public contentId
    @inject(TYPES.ISubscribableMutableId) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
}

export {SubscribableBasicTree, SubscribableBasicTreeArgs, ISubscribableBasicTree}
