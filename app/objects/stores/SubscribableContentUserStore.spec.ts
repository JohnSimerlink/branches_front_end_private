import {expect} from 'chai'
import * as sinon from 'sinon'
import {log} from '../../../app/core/log'
import {CONTENT_ID2} from '../../testHelpers/testHelpers';
import {MutableSubscribableContentUser} from '../contentUserData/MutableSubscribableContentUser';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    ContentUserPropertyNames, FieldMutationTypes, IProppedDatedMutation, ISubscribableContentUserCore,
    ISubscribableContentUserStore
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {SubscribableStore} from './SubscribableStore';

describe('SubscribableContentUserStore > addAndSubscribeToItem', () => {
    it('An update in a member contentUser should be published to a subscriber of the contentUser data stores', () => {
        /* TODO: Note this is more of an integration test than a true unit test.
        It might be that some of these modules are designed poorly, being the reason
         why I couldn't find an easy way to do a pure unit test.
         e.g. rather than just triggering an update directly on contentUser,
         I had to do it indirectly by adding a mutation
         */
        const contentId = CONTENT_ID2
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new MutableSubscribableContentUser({
                lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
            })
        const contentUserStore: ISubscribableContentUserStore = new SubscribableStore<ISubscribableContentUserCore>({
            store: {},
            updatesCallbacks: []
        })
        // const contentUserStore = myContainer.get<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore)
        const callback1 = sinon.spy()
        const callback2 = sinon.spy()

        contentUserStore.onUpdate(callback1)
        contentUserStore.onUpdate(callback2)
        contentUserStore.startPublishing()
        /* TODO: add test to put subscribeToAllItems() before the onUpdates to show it works irrespective of order
         */
        contentUser.startPublishing()
        contentUserStore.addAndSubscribeToItem( contentId, contentUser)

        const sampleMutation: IProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
            data: PROFICIENCIES.TWO,
            propertyName: ContentUserPropertyNames.PROFICIENCY,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }

        contentUser.addMutation(sampleMutation)

        const contentUserNewVal = contentUser.val()
        // expect(callback1.callCount).to.equal(1)
        // expect(callback1.getCall(0).args[0].id).to.equal(contentId)
        // expect(callback1.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
        // expect(callback2.callCount).to.equal(1)
        log('contentUser val is', contentUserNewVal)
        expect(callback2.getCall(0).args[0].id).to.equal(contentId)
        expect(callback2.getCall(0).args[0].val).to.deep.equal(contentUserNewVal)
    })
})
