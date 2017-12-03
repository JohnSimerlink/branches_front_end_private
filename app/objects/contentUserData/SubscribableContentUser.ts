// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
// import {inject, injectable} from 'inversify';
// import {
//     ISubscribableMutableId,
//     ISubscribableMutableStringSet, ISubscribableTree,
//     ITreeDataWithoutId,
//     IValUpdates,
//     TreeMutationTypes,
// } from '../interfaces';
// import {Subscribable} from '../subscribable/Subscribable';
// import {TYPES} from '../types'
//
// @injectable()
// class SubscribableContentUser extends Subscribable<TreeMutationTypes, IValUpdates> implements ISubscribableTree {
//
//     // TODO: should the below three objects be private?
//     public contentId: ISubscribableMutableId;
//     public parentId: ISubscribableMutableId;
//     public children: ISubscribableMutableStringSet;
//     private id: string;
//
//     public getId() {
//         return this.id
//     }
//     public val(): ITreeDataWithoutId {
//         return {
//             children: this.children.val(),
//             contentId: this.contentId.val(),
//             parentId: this.parentId.val(),
//         }
//     }
//     constructor(@inject(TYPES.SubscribableTreeArgs) {updatesCallbacks, id, contentId, parentId, children}) {
//         super({updatesCallbacks})
//         this.id = id
//         this.contentId = contentId
//         this.parentId = parentId
//         this.children = children
//     }
//     protected callbackArguments(): IValUpdates {
//         return this.val()
//     }
//     public startPublishing() {
//         const boundCallCallbacks = this.callCallbacks.bind(this)
//         this.children.onUpdate(boundCallCallbacks)
//         this.contentId.onUpdate(boundCallCallbacks)
//         this.parentId.onUpdate(boundCallCallbacks)
//     }
// }
//
// @injectable()
// class SubscribableTreeArgs {
//     @inject(TYPES.Array) public updatesCallbacks
//     @inject(TYPES.String) public id
//     @inject(TYPES.ISubscribableMutableId) public contentId
//     @inject(TYPES.ISubscribableMutableId) public parentId
//     @inject(TYPES.ISubscribableMutableStringSet) public children
// }
//
// export {ISubscribableTree, SubscribableTree, SubscribableTreeArgs}
