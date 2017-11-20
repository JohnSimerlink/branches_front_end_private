// import {MutationTypes} from './MutationTypes'
// export interface IMutation {
//     type: MutationTypes,
//     data
// }
export interface IMutation<MutationTypes> {
    type: MutationTypes,
    data
}
export interface IDatedMutation<MutationTypes> extends IMutation<MutationTypes> {
    timestamp: number // ISO 8601 POSIX Timestamp
}
export interface IActivatableMutation<MutationTypes> extends IMutation<MutationTypes> {
    active: boolean
}
export interface IActivatableDatedMutation<MutationTypes>
    extends IDatedMutation<MutationTypes>, IActivatableMutation<MutationTypes> {
}
