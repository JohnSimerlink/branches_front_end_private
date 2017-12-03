import {expect} from 'chai'
import {myContainer} from '../../../inversify.config';
import {
    ISubscribableMutableField,
    ISubscribableMutableStringSet,
} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableTree} from './SubscribableTree';

describe('SubscribableTree', () => {
    it('constructor should set all the subscribable properties', () => {
        const contentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
        const parentId = myContainer.get<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString)
        const children = myContainer.get<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet)
        const TREE_ID = 'efa123'
        const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        expect(tree.contentId).to.deep.equal(contentId)
        expect(tree.parentId).to.deep.equal(parentId)
        expect(tree.children).to.deep.equal(children)
        expect(tree.getId()).to.deep.equal(TREE_ID)
    })
})
