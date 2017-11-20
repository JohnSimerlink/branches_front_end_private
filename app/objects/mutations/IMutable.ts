import {MutationTypes} from './MutationTypes';

interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    // _isMutationRedundant(mutation: MutationInterface),
    // subscribeToMutations(), // TODO: Maybe separate this into another interface
    mutations(): MutationInterface[],
    /* TODO: Arrays are evil for firebase / distributed data.
     might have to replace this with a set.
      - https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      - https://firebase.googleblog.com/2014/05/handling-synchronized-arrays-with-real.html*/
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
