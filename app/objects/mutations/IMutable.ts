import {MutationTypes} from './MutationTypes';

interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    // _isMutationRedundant(mutation: MutationInterface),
    // subscribeToMutations(), // TODO: Maybe separate this into another interface
    mutations(): MutationInterface[],
}
interface IUndoableMutable<MutationInterface> extends IMutable<MutationInterface> {
    undo(mutationListIndex: number),
    redo(mutationListIndex: number)
}
export {IMutable, IUndoableMutable}
// export interface ITreeMutation extends IMutation {
//    type: TreeMutationTypes,
// }
// export interface IUserMutation extends IMutation {
//     type: UserMutationTypes,
// }
