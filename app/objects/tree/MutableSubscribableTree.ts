// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    FieldMutationTypes,
    IDatedMutation,
    IMutableSubscribableTree,
    IProppedDatedMutation,
    SetMutationTypes,
    TreePropertyMutationTypes,
    TreePropertyNames
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableTree, SubscribableTreeArgs} from './SubscribableTree';
import {log} from '../../core/log';

@injectable()
export class MutableSubscribableTree extends SubscribableTree implements IMutableSubscribableTree {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableTreeArgs) {
        updatesCallbacks, id, contentId,
        parentId, children}: SubscribableTreeArgs ) {
        super({updatesCallbacks, id, contentId, parentId, children});
    }

    public addMutation(mutation: IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>
        // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
        const propertyName: TreePropertyNames = mutation.propertyName;
        const propertyMutation: IDatedMutation<TreePropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        };
        switch (propertyName) {
            case TreePropertyNames.CONTENT_ID:
                this.contentId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
                break;
            case TreePropertyNames.PARENT_ID:
                this.parentId.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
                break;
            case TreePropertyNames.CHILDREN:
                this.children.addMutation(propertyMutation as IDatedMutation<SetMutationTypes>);
                // ^^ TODO: figure out a better typesafety solution. casting is kind of scary.
                break;
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property ');
        }
    }

    public mutations(): Array<IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
        throw new Error('Not Implemented!');
    }
}
