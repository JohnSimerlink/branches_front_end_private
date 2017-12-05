// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {CONTENT_ID2, TREE_ID} from '../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    FieldMutationTypes,
    IGlobalDatedMutation, IIdProppedDatedMutation,
    IMutableSubscribableGlobalStore, IMutableSubscribableTreeStore, ISubscribableContentUserStore,
    ObjectTypes, TreePropertyNames
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../tree/MutableSubscribableTree';
import {SubscribableContentUserStore} from './contentUser/SubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from './MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from './tree/MutableSubscribableTreeStore';

describe('MutableSubscribableGlobalStore', () => {
    it('adding a tree mutation should call treeStore.addMutation(mutationObj)'
        + ' but without the objectType in mutationObj', () => {

        const contentId = new SubscribableMutableField<string>({field: CONTENT_ID2 })
        const parentId = new SubscribableMutableField<string>({field: 'adf12356' })
        const children = new SubscribableMutableStringSet()
        const id = TREE_ID
        const tree = new MutableSubscribableTree({
            id, contentId, parentId, children, updatesCallbacks: [],
        })
        const store = {}
        store[TREE_ID] = tree

        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore( {
            store,
            updatesCallbacks: []
        })

        const contentUserStore: ISubscribableContentUserStore = new SubscribableContentUserStore({
            store: {},
            updatesCallbacks: []
        })

        const globalStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentUserStore,
                treeStore,
                updatesCallbacks: [],
            }
        )
        const NEW_CONTENT_ID = 'def123'
        const objectType = ObjectTypes.TREE
        const propertyName = TreePropertyNames.CONTENT_ID;
        const type = FieldMutationTypes.SET;
        const data = NEW_CONTENT_ID
        const timestamp = Date.now()

        const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, TreePropertyNames> = {
            data, id, propertyName, timestamp, type
        }

        const globalMutation: IGlobalDatedMutation<FieldMutationTypes> = {
            objectType,
            ...storeMutation
        }
        const storeAddMutationSpy = sinon.spy(treeStore, 'addMutation')

        globalStore.addMutation(globalMutation)

        const calledWith = storeAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(storeMutation)
        expect(storeAddMutationSpy.callCount).to.deep.equal(1)

    })

})
