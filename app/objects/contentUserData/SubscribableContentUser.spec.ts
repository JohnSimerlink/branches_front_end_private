// import {expect} from 'chai'
// import * as sinon from 'sinon'
// import {myContainer} from '../../../inversify.config';
// import {
//     ISubscribableMutableField,
//     ISubscribableMutableStringSet,
// } from '../interfaces';
// import {TYPES} from '../types';
// import {SubscribableTree} from './SubscribableTree';
//
// describe('SubscribableTree', () => {
//     it('constructor should set all the subscribable properties', () => {
//         const contentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const parentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
//         const TREE_ID = 'efa123'
//         const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
//         expect(tree.contentId).to.deep.equal(contentId)
//         expect(tree.parentId).to.deep.equal(parentId)
//         expect(tree.children).to.deep.equal(children)
//         expect(tree.getId()).to.deep.equal(TREE_ID)
//     })
//     it('.val() should display the value of the object', () => {
//         const contentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const parentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
//         const TREE_ID = 'efa123'
//         const expectedVal = {
//             children: children.val(),
//             contentId: contentId.val(),
//             parentId: parentId.val(),
//         }
//         const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
//         expect(tree.val()).to.deep.equal(expectedVal)
//     })
//     it('.getId() should display the id of the object', () => {
//         const contentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const parentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
//         const TREE_ID = 'efa123'
//         const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
//         expect(tree.getId()).to.deep.equal(TREE_ID)
//     })
//     it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
//         const contentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const parentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
//         const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
//         const TREE_ID = 'efa123'
//         const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
//         const contentIdOnUpdateSpy = sinon.spy(contentId, 'onUpdate')
//         const parentIdOnUpdateSpy = sinon.spy(parentId, 'onUpdate')
//         const childrenOnUpdateSpy = sinon.spy(children, 'onUpdate')
//         tree.startPublishing()
//         expect(contentIdOnUpdateSpy.callCount).to.deep.equal(1)
//         expect(parentIdOnUpdateSpy.callCount).to.deep.equal(1)
//         expect(childrenOnUpdateSpy.callCount).to.deep.equal(1)
//     })
// })

