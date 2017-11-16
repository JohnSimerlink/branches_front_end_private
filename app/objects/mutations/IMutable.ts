import {MutationTypes} from './MutationTypes';

export interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    // _isMutationRedundant(mutation: MutationInterface),
    // subscribeToMutations(), // TODO: Maybe separate this into another interface
    mutations(): MutationInterface[],
}
export interface IUndoableMutable<MutationInterface> extends IMutable<MutationInterface> {
    undo(index: number),
    redo(index: number)
}
// export interface ITreeMutation extends IMutation {
//    type: TreeMutationTypes,
// }
// export interface IUserMutation extends IMutation {
//     type: UserMutationTypes,
// }
