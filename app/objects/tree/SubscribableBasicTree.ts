// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IdMutationTypes} from '../id/IdMutationTypes';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {IMutableId} from '../id/MutableId';
import {IDatedMutation, IMutation} from '../mutations/IMutation';
import {IMutableStringSet} from '../set/IMutableStringSet';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {SetMutationTypes} from '../set/SetMutationTypes';
import {TYPES} from '../types'
import {IBasicTree} from './IBasicTree';
import {ISubscribableBasicTree} from './ISubscribableBasicTree';
import {IUpdates} from '../dbSync/IUpdates';

@injectable()
class SubscribableBasicTree implements ISubscribableBasicTree {

    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableId;
    public parentId: ISubscribableMutableId;
    public children: ISubscribableMutableStringSet;
    private id: string;

    public getId() {
        return this.id
    }
    constructor(@inject(TYPES.SubscribableBasicTreeArgs) {id, contentId, parentId, children}) {
        this.id = id
        this.contentId = contentId
        this.parentId = parentId
        this.children = children
    }
    public addDescendantMutation(
        propertyName: TreePropertyNames,
        mutation: IDatedMutation<SetMutationTypes & IdMutationTypes>
    ) {
        switch (propertyName) {
            case 'contentId':
                this.contentId.addMutation(mutation)
                break;
            case 'parentId':
                this.parentId.addMutation(mutation)
                break;
            case 'children':
                this.children.addMutation(mutation)
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
    @inject(TYPES.String) public id
    @inject(TYPES.ISubscribableMutableId) public contentId
    @inject(TYPES.ISubscribableMutableId) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
}

export {SubscribableBasicTree, SubscribableBasicTreeArgs}
