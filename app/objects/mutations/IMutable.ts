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
    ADD_LEAF,
    REMOVE_LEAF,
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
