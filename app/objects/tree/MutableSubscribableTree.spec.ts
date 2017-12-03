import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {CONTENT_ID, CONTENT_ID3, TREE_ID3} from '../../testHelpers/testHelpers';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {IDatedMutation, FieldMutationTypes, IProppedDatedMutation, TreePropertyNames} from '../interfaces';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableTree} from './MutableSubscribableTree';
import {SubscribableTree} from './SubscribableTree';
import {Tree} from './tree';

describe('SubscribableTree', () => {
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value '
        + ' after startPublishing has been called', () => {
        const contentId = new SubscribableMutableField<string>()
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const parentId = new SubscribableMutableField<string>()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new MutableSubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        tree.startPublishing()

        const callback = sinon.spy()
        tree.onUpdate(callback)

        const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IProppedDatedMutation)
        contentId.addMutation(sampleMutation)
        const newTreeDataValue = tree.val()
        const calledWith = callback.getCall(0).args[0]
        expect(callback.callCount).to.equal(1)
        expect(calledWith).to.deep.equal(newTreeDataValue)
    })
    it('a mutation in one of the subscribable properties' +
        ' should NOT publish an update of the entire object\'s value'
        + ' before startPublishing has been called', () => {
        const contentId = new SubscribableMutableField<string>()
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const parentId = new SubscribableMutableField<string>()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = 'efa123'
        const tree = new SubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})

        const callback = sinon.spy()
        tree.onUpdate(callback)

        const sampleMutation = myContainer.get<IDatedMutation<FieldMutationTypes>>(TYPES.IProppedDatedMutation)
        contentId.addMutation(sampleMutation)
        const newTreeDataValue = tree.val()
        expect(callback.callCount).to.equal(0)
    })
    it('addMutation ' +
        ' should call addMutation on the appropriate descendant property' +
        'and that mutation called on the descendant property should no longer have the propertyName on it', () => {
        const contentId = new SubscribableMutableField<string>()
        const parentId = new SubscribableMutableField<string>()
        const children = new SubscribableMutableStringSet()
        const TREE_ID = TREE_ID3
        const tree = new MutableSubscribableTree({updatesCallbacks: [], id: TREE_ID, contentId, parentId, children})
        const contentIdAddMutationSpy = sinon.spy(contentId, 'addMutation')

        // tslint:disable variable-name
        // TODO: create that mu
        const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
            data: {
                id: CONTENT_ID3,
            },
            timestamp: Date.now(),
            type: FieldMutationTypes.SET
        }
        const mutation: IProppedDatedMutation<FieldMutationTypes, TreePropertyNames> = {
            ...mutationWithoutPropName,
            propertyName: TreePropertyNames.CONTENT_ID,
        }

        tree.addMutation(mutation)
        expect(contentIdAddMutationSpy.callCount).to.equal(1)
        const calledWith = contentIdAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(mutationWithoutPropName)

    })
})
