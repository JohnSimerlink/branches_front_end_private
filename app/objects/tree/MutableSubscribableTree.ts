// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDatedMutation,
    FieldMutationTypes, IMutableSubscribableTree,
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
        const propertyMutation: IDatedMutation<TreePropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        switch (propertyName) {
            case TreePropertyNames.CONTENT_ID:
            case TreePropertyNames.PARENT_ID:
                this.contentId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break;
            case TreePropertyNames.CHILDREN:
                this.children.addMutation(propertyMutation as IDatedMutation<SetMutationTypes>)
                // ^^ TODO: figure out a better typesafety solution. casting is kind of scary.
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
