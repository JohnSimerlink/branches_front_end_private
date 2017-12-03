// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDatedMutation,
    IdMutationTypes, IMutableSubscribableTree,
    IProppedDatedMutation, ISubscribableTree,
    SetMutationTypes,
    TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {TYPES} from '../types'
import {SubscribableTree} from './SubscribableTree';

@injectable()
class MutableSubscribableTree extends SubscribableTree implements IMutableSubscribableTree {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableTreeArgs) {updatesCallbacks, id, contentId, parentId, children}) {
        super({updatesCallbacks, id, contentId, parentId, children})
    }

    public addMutation(mutation: IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>
        // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
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

    public mutations(): Array<IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
        throw new Error('Not Implemented!')
    }
}

@injectable()
class SubscribableTreeArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.String) public id
    @inject(TYPES.ISubscribableMutableId) public contentId
    @inject(TYPES.ISubscribableMutableId) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
}

export {ISubscribableTree, MutableSubscribableTree, SubscribableTreeArgs}
