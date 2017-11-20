/* tslint:disable variable-name */
// import {log} from '../../core/log'
import {IMutable, IUndoableMutable} from '../mutations/IMutable';
import {IActivatableDatedMutation, IDatedMutation} from '../mutations/IMutation';
import {ISet} from './ISet';
import {SetMutationTypes} from './SetMutationTypes';
/*
Decided to not implement IUndoable on this class, because undo/redo add/remove aren't
 as commutative as they seem . . . at least for the complicated specs I was setting for myself . . .
 See the commit history for the commit before this file was created to see what I mean.
 */
class MutableStringSet implements IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {

    private _mutations: Array<IDatedMutation<SetMutationTypes>>;
    private set: object;
    constructor({set, mutations} = {set: {}, mutations: []}) {
        this.set = set
        this._mutations = mutations
    }
    public getMembers(): string[] {
        return Object.keys(this.set)
    }

    private add(member: string) {
        if (this.set[member]) {
            throw new RangeError(
                member + ' is already a member. The members are' + JSON.stringify(this.getMembers())
            )
        }
        this.set[member] = true
    }

    private remove(member: string) {
        if (!this.set[member]) {
            throw new RangeError(member + ' is not a member. The members are' + JSON.stringify(this.getMembers()))
        }
        delete this.set[member]
    }
    public hasMember(member: string): boolean {
        return this.set[member]
    }
    public addMutation(mutation: IDatedMutation<SetMutationTypes>) {
        switch (mutation.type) {
            case SetMutationTypes.ADD:
                this.add(mutation.data.member) // TODO: Law of Demeter Violation? How to fix?
                break;
            case SetMutationTypes.REMOVE:
                this.remove(mutation.data.member) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(SetMutationTypes))
        }
        this._mutations.push(mutation)
    }

    public mutations(): Array<IDatedMutation<SetMutationTypes>> {
        return this._mutations;
    }

}

export {MutableStringSet}
