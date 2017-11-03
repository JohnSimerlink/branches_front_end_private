export interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    _isMutationRedundant(mutation: MutationInterface),
    subscribeToMutations(),
}

interface IMutation {
    type: any,
    data,
}
export enum TreeMutationTypes {
    ADD_CHILD,
    REMOVE_CHILD,
}
enum UserMutationTypes {
    SOME_ACTION,
}
export interface ITreeMutation extends IMutation {
   type: TreeMutationTypes,
}
export interface IUserMutation extends IMutation {
    type: UserMutationTypes,
}
