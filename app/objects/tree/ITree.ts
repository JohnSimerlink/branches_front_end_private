interface ITreeMutation {
   type: TreeMutationType,
}
enum TreeMutationType {
    ADD_LEAF,
    REMOVE_LEAF,
}
