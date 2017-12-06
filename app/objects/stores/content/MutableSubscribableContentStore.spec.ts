// // tslint:disable object-literal-sort-keys
// import {expect} from 'chai'
// import * as sinon from 'sinon'
// import {CONTENT_ID2} from '../../../testHelpers/testHelpers';
// import {MutableSubscribableContent} from '../../contentData/MutableSubscribableContent';
// import {SubscribableMutableField} from '../../field/SubscribableMutableField';
// import {
//     ContentPropertyMutationTypes,
//     ContentPropertyNames, FieldMutationTypes, IIdProppedDatedMutation, IMutableSubscribableContentStore,
//     IProppedDatedMutation
// } from '../../interfaces';
// import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
// import {MutableSubscribableContentStore} from './MutableSubscribableContentStore';
//
// describe('MutableSubscribableContentStore > addMutation', () => {
//     it('addMutation to store should call addMutation on the appropriate item,' +
//         ' and with a modified mutation argument that no longer has the id', () => {
//         const contentId = CONTENT_ID2
//         const overdue = new SubscribableMutableField<boolean>({field: false})
//         const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
//         const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
//         const timer = new SubscribableMutableField<number>({field: 30})
//         const content = new MutableSubscribableContent({
//             lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
//         })
//         const store = {}
//         store[contentId] = content
//         const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
//             store,
//             updatesCallbacks: []
//         })
//         const contentAddMutationSpy = sinon.spy(content, 'addMutation')
//
//         const proppedMutation: IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
//             data: PROFICIENCIES.TWO,
//             propertyName: ContentPropertyNames.PROFICIENCY,
//             timestamp: Date.now(),
//             type: FieldMutationTypes.SET,
//         }
//
//         const sampleMutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
//             ...proppedMutation,
//             id: contentId,
//         }
//
//         contentStore.addMutation(sampleMutation)
//
//         expect(contentAddMutationSpy.callCount).to.equal(1)
//         const calledWith = contentAddMutationSpy.getCall(0).args[0]
//         expect(calledWith).to.deep.equal(proppedMutation)
//     })
//     it('addMutation to store that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
//         ' it either, should throw a RangeError', () => {
//         const contentId = CONTENT_ID2
//         const nonExistentId = 'abdf1295'
//         const overdue = new SubscribableMutableField<boolean>({field: false})
//         const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
//         const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
//         const timer = new SubscribableMutableField<number>({field: 30})
//         const content = new MutableSubscribableContent({
//             lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
//         })
//         const store = {}
//         store[contentId] = content
//         const contentStore: IMutableSubscribableContentStore = new MutableSubscribableContentStore({
//             store,
//             updatesCallbacks: []
//         })
//
//         const proppedMutation: IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
//             data: PROFICIENCIES.TWO,
//             propertyName: ContentPropertyNames.PROFICIENCY,
//             timestamp: Date.now(),
//             type: FieldMutationTypes.SET,
//         }
//
//         const sampleMutation: IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames> = {
//             ...proppedMutation,
//             id: nonExistentId,
//         }
//         expect(() => contentStore.addMutation(sampleMutation)).to.throw(RangeError)
//     })
// })
