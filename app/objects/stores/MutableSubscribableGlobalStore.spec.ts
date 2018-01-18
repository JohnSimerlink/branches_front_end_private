// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {CONTENT_ID, CONTENT_ID2, injectionWorks, TREE_ID} from '../../testHelpers/testHelpers';
import {MutableSubscribableContent} from '../content/MutableSubscribableContent';
import {MutableSubscribableContentUser} from '../contentUser/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    CONTENT_TYPES, ContentPropertyNames,
    ContentUserPropertyNames,
    FieldMutationTypes,
    ITypeIdProppedDatedMutation, IIdProppedDatedMutation, IMutableSubscribableContent, IMutableSubscribableContentStore,
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
import {partialInject} from '../../testHelpers/partialInject';

test('MutableSubscribableGlobalStore:::Dependency injection should set all properties in constructor', (t) => {
    const injects: boolean = injectionWorks<MutableSubscribableGlobalStoreArgs, IMutableSubscribableGlobalStore>({
        container: myContainer,
        argsType: TYPES.MutableSubscribableGlobalStoreArgs,
        interfaceType: TYPES.IMutableSubscribableGlobalStore
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('MutableSubscribableGlobalStore:::adding a tree mutation should call treeStore.addMutation(mutationObj)'
    + ' but without the objectType in mutationObj', (t) => {

    const contentId = new SubscribableMutableField<string>({field: CONTENT_ID2})
    const parentId = new SubscribableMutableField<string>({field: 'adf12356'})
    const children = new SubscribableMutableStringSet()
    const id = TREE_ID
    const tree = new MutableSubscribableTree({
        id, contentId, parentId, children, updatesCallbacks: [],
    })

    const storeSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>
    (TYPES.ISubscribableTreeStoreSource)
    storeSource.set(TREE_ID, tree)
    const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
        storeSource,
        updatesCallbacks: []
    })

    const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
        konstructor: MutableSubscribableGlobalStore,
        constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
        injections: {treeStore},
        container: myContainer
    })

    const NEW_CONTENT_ID = 'def123'
    const objectType = ObjectTypes.TREE
    const propertyName = TreePropertyNames.CONTENT_ID;
    const type = FieldMutationTypes.SET;
    const data = NEW_CONTENT_ID
    const timestamp = Date.now()

    const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, TreePropertyNames> = {
        data, id, propertyName, timestamp, type
    }

    const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
        objectType,
        ...storeMutation
    }
    const storeAddMutationSpy = sinon.spy(treeStore, 'addMutation')

    globalStore.addMutation(globalMutation)

    const calledWith = storeAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(storeMutation)
    expect(storeAddMutationSpy.callCount).to.deep.equal(1)
    t.pass()

})
test('MutableSubscribableGlobalStore:::adding a contentUser mutation should' +
    ' call contentUserStore.addMutation(mutationObj)'
    + ' but without the objectType in mutationObj', (t) => {

    // contentUserStore
    const contentId = CONTENT_ID
    const userId = '1239857'
    const contentUserId = contentId + userId
    const overdue = new SubscribableMutableField<boolean>({field: false})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer = new SubscribableMutableField<number>({field: 30})
    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId, lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
    })
    const storeSource: ISubscribableContentUserStoreSource
        = myContainer.get<ISubscribableContentUserStoreSource>
    (TYPES.ISubscribableContentUserStoreSource)
    storeSource.set(contentId, contentUser)
    const contentUserStore: IMutableSubscribableContentUserStore = new MutableSubscribableContentUserStore({
        storeSource,
        updatesCallbacks: []
    })

    const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
        konstructor: MutableSubscribableGlobalStore,
        constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
        injections: {contentUserStore},
        container: myContainer
    })
    const newProficiencyVal = PROFICIENCIES.THREE
    const objectType = ObjectTypes.CONTENT_USER
    const propertyName = ContentUserPropertyNames.PROFICIENCY;
    const type = FieldMutationTypes.SET;
    const data = newProficiencyVal
    const timestamp = Date.now()

    const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
        data, id: contentId, propertyName, timestamp, type
    }

    const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
        objectType,
        ...storeMutation
    }
    const storeAddMutationSpy = sinon.spy(contentUserStore, 'addMutation')

    globalStore.addMutation(globalMutation)

    const calledWith = storeAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(storeMutation)
    expect(storeAddMutationSpy.callCount).to.deep.equal(1)
    t.pass()

})

test('MutableSubscribableGlobalStore:::adding a content mutation should call contentStore.addMutation(mutationObj)'
    + ' but without the objectType in mutationObj', (t) => {

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

    const globalStore: IMutableSubscribableGlobalStore = partialInject<MutableSubscribableGlobalStoreArgs>({
        konstructor: MutableSubscribableGlobalStore,
        constructorArgsType: TYPES.MutableSubscribableGlobalStoreArgs,
        injections: {contentStore},
        container: myContainer
    })
    const newQuestionVal = 'What is the capital of Iowa?'
    const objectType = ObjectTypes.CONTENT
    const propertyName = ContentPropertyNames.QUESTION;
    const mutationType = FieldMutationTypes.SET;
    const data = newQuestionVal
    const timestamp = Date.now()

    const storeMutation: IIdProppedDatedMutation<FieldMutationTypes, ContentPropertyNames> = {
        data, id: contentId, propertyName, timestamp, type: mutationType,
    }

    const globalMutation: ITypeIdProppedDatedMutation<FieldMutationTypes> = {
        objectType,
        ...storeMutation
    }
    const storeAddMutationSpy = sinon.spy(contentStore, 'addMutation')

    globalStore.addMutation(globalMutation)

    const calledWith = storeAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(storeMutation)
    expect(storeAddMutationSpy.callCount).to.deep.equal(1)
    t.pass()
})
