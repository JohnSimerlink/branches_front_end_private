// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {CONTENT_ID, CONTENT_ID2, injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {MutableSubscribableContent} from '../content/MutableSubscribableContent';
import {MutableSubscribableContentUser} from '../contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    CONTENT_TYPES, ContentPropertyNames,
    ContentUserPropertyNames,
    FieldMutationTypes,
    IGlobalDatedMutation, IIdProppedDatedMutation, IMutableSubscribableContent, IMutableSubscribableContentStore,
    IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore, IMutableSubscribableTree,
    IMutableSubscribableTreeLocationStore,
    IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUserStore, ISubscribableContentStoreSource, ISubscribableContentUserStoreSource,
    ISubscribableStoreSource, ISubscribableTreeStoreSource,
    ObjectTypes, TreePropertyNames
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../tree/MutableSubscribableTree';
import {TYPES} from '../types';
import {MutableSubscribableContentStore} from './content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from './contentUser/MutableSubscribableContentUserStore';
import {MutableSubscribableGlobalStore, MutableSubscribableGlobalStoreArgs} from './MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from './tree/MutableSubscribableTreeStore';

describe('MutableSubscribableGlobalStore', () => {
    it('Dependency injection should set all properties in constructor', () => {
        const injects: boolean = injectionWorks<MutableSubscribableGlobalStoreArgs, IMutableSubscribableGlobalStore>({
            container: myContainer,
            argsType: TYPES.MutableSubscribableGlobalStoreArgs,
            classType: TYPES.IMutableSubscribableGlobalStore
        })
        expect(injects).to.equal(true)
    })
    it('adding a tree mutation should call treeStore.addMutation(mutationObj)'
        + ' but without the objectType in mutationObj', () => {

        const contentId = new SubscribableMutableField<string>({field: CONTENT_ID2 })
        const parentId = new SubscribableMutableField<string>({field: 'adf12356' })
        const children = new SubscribableMutableStringSet()
        const id = TREE_ID
        const tree = new MutableSubscribableTree({
            id, contentId, parentId, children, updatesCallbacks: [],
        })

        const storeSource: ISubscribableTreeStoreSource
            = myContainer.get<ISubscribableTreeStoreSource>
        (TYPES.ISubscribableTreeStoreSource)
        storeSource.set(TREE_ID, tree)
        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore( {
            storeSource,
            updatesCallbacks: []
        })

        const treeUserStore: IMutableSubscribableTreeUserStore
            = myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

        const treeLocationStore: IMutableSubscribableTreeLocationStore
            = myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

        const contentStore: IMutableSubscribableContentStore
            = myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

        const contentUserStore: IMutableSubscribableContentUserStore
            = myContainer.get<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)

        const globalStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentStore,
                contentUserStore,
                treeStore,
                treeLocationStore,
                treeUserStore,
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
    it('adding a contentUser mutation should call contentUserStore.addMutation(mutationObj)'
        + ' but without the objectType in mutationObj', () => {

        // contentUserStore
        const contentId = CONTENT_ID
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new MutableSubscribableContentUser({
            lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
        })
        const storeSource: ISubscribableContentUserStoreSource
            = myContainer.get<ISubscribableContentUserStoreSource>
        (TYPES.ISubscribableContentUserStoreSource)
        storeSource.set(contentId, contentUser)
        const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
            storeSource,
            updatesCallbacks: []
        })

        const contentStore: IMutableSubscribableContentStore
            = myContainer.get<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)

        const treeStore: IMutableSubscribableTreeStore
            = myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

        const treeUserStore: IMutableSubscribableTreeUserStore
            = myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

        const treeLocationStore: IMutableSubscribableTreeLocationStore
            = myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

        const globalStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentStore,
                contentUserStore,
                treeStore,
                treeUserStore,
                treeLocationStore,
                updatesCallbacks: [],
            }
        )
        const newProficiencyVal = PROFICIENCIES.THREE
        const objectType = ObjectTypes.CONTENT_USER
        const propertyName = ContentUserPropertyNames.PROFICIENCY;
        const type = FieldMutationTypes.SET;
        const data = newProficiencyVal
        const timestamp = Date.now()

        const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
            data, id: contentId, propertyName, timestamp, type
        }

        const globalMutation: IGlobalDatedMutation<FieldMutationTypes> = {
            objectType,
            ...storeMutation
        }
        const storeAddMutationSpy = sinon.spy(contentUserStore, 'addMutation')

        globalStore.addMutation(globalMutation)

        const calledWith = storeAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(storeMutation)
        expect(storeAddMutationSpy.callCount).to.deep.equal(1)

    })

    it('adding a content mutation should call contentStore.addMutation(mutationObj)'
        + ' but without the objectType in mutationObj', () => {

        // contentStore
        const contentId = CONTENT_ID
        const type = new SubscribableMutableField<CONTENT_TYPES>({field: CONTENT_TYPES.FACT})
        const question = new SubscribableMutableField<string>({field: 'What is capital of Ohio?'})
        const answer = new SubscribableMutableField<string>({field: 'Columbus'})
        const title = new SubscribableMutableField<string>({field: ''})
        const content = new MutableSubscribableContent({
            type, question, answer, title, updatesCallbacks: [],
        })

        const storeSource: ISubscribableContentStoreSource
            = myContainer.get<ISubscribableContentStoreSource>
        (TYPES.ISubscribableContentStoreSource)
        storeSource.set(contentId, content)
        const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
            storeSource,
            updatesCallbacks: []
        })

        const contentUserStore: IMutableSubscribableContentUserStore =
            myContainer.get<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)

        const treeStore: IMutableSubscribableTreeStore
            = myContainer.get<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore)

        const treeUserStore: IMutableSubscribableTreeUserStore
            = myContainer.get<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)

        const treeLocationStore: IMutableSubscribableTreeLocationStore
            = myContainer.get<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)

        const globalStore: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentStore,
                contentUserStore,
                treeStore,
                treeLocationStore,
                treeUserStore,
                updatesCallbacks: [],
            }
        )
        const newQuestionVal = 'What is the capital of Iowa?'
        const objectType = ObjectTypes.CONTENT
        const propertyName = ContentPropertyNames.QUESTION;
        const mutationType = FieldMutationTypes.SET;
        const data = newQuestionVal
        const timestamp = Date.now()

        const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentPropertyNames> = {
            data, id: contentId, propertyName, timestamp, type: mutationType,
        }

        const globalMutation: IGlobalDatedMutation<FieldMutationTypes> = {
            objectType,
            ...storeMutation
        }
        const storeAddMutationSpy = sinon.spy(contentStore, 'addMutation')

        globalStore.addMutation(globalMutation)

        const calledWith = storeAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(storeMutation)
        expect(storeAddMutationSpy.callCount).to.deep.equal(1)
    })

})
