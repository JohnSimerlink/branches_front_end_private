/* tslint:disable variable-name */
// import {log} from '../../core/log'
import {IMutable, IUndoableMutable} from '../mutations/IMutable';
import {IActivatableDatedMutation, IDatedMutation} from '../mutations/IMutation';
import {PointMutationTypes} from '../point/PointMutationTypes';
import {ITree} from './ITree';
import {ITreeChildren} from './ITreeChildren'
import {TreeMutationTypes} from './TreeMutationTypes';
/*
Decided to not implement IUndoable on this class, because undo/redo add/remove aren't
 as commutative as they seem . . . at least for the complicated specs I was setting for myself . . .
 See the commit history for the commit before this file was created to see what I mean.
 */
class MutableTreeChildren implements IMutable<IDatedMutation>, ITreeChildren {
    private _mutations: IDatedMutation[];
    private childSet: object;
    constructor({childSet, mutations} = {childSet: {}, mutations: []}) {
        this.childSet = childSet
        this._mutations = mutations
    }
    public getIds(): string[] {
        return Object.keys(this.childSet)
    }

    public add(childId: string) {
        if (this.childSet[childId]) {
            throw new RangeError(
                childId + ' is already a childId. The children are' + JSON.stringify(this.getIds())
            )
        }
        this.childSet[childId] = true
    }

    public remove(childId: string) {
        if (!this.childSet[childId]) {
            throw new RangeError(childId + ' is not a childId. The children are' + JSON.stringify(this.getIds()))
        }
        delete this.childSet[childId]
    }
    public hasChild(childId: string): boolean {
        return this.childSet[childId]
    }
    public addMutation(mutation: IDatedMutation) {
        switch (mutation.type) {
            case TreeMutationTypes.ADD_CHILD:
                this.add(mutation.data.childId) // TODO: Law of Demeter Violation? How to fix?
                break;
            case TreeMutationTypes.REMOVE_CHILD:
                this.remove(mutation.data.childId) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(TreeMutationTypes))
        }
        this._mutations.push(mutation)
    }

    public mutations(): IDatedMutation[] {
        return this._mutations;
    }

}

export {MutableTreeChildren}
