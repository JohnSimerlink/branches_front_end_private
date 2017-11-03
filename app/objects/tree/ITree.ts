export interface ITree {
    children,
    mutations: ITreeMutation[],
}

interface ITreeMutation {
   type: TreeMutationType,
}
enum TreeMutationType {
    ADD_LEAF,
    REMOVE_LEAF,
}
