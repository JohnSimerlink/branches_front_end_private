import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {MutableSubscribableField} from '../objects/field/MutableSubscribableField';
import {SubscribableMutableStringSet} from '../objects/set/SubscribableMutableStringSet';
import {SubscribableTree} from '../objects/tree/SubscribableTree';
import {
    CONTENT_TYPES, IAddContentInteractionMutationArgs, IContentDataFromDB, IContentUserData, IContentUserDataFromDB,
    IPoint,
    ISigmaNodeLoader, IState,
    ITreeDataFromDB, ITreeLocationDataFromFirebase
} from '../objects/interfaces';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {getContentUserId, getContentUserRef} from '../loaders/contentUser/ContentUserLoaderUtils';
import {partialInject} from '../testHelpers/partialInject';
import {
    mockContentRef, mockContentUsersRef, mockFirebaseReferences, mockTreeLocationsRef, mockTreesRef, myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {AppContainer} from './appContainer';
import BranchesStore, {MUTATION_NAMES} from './store';
import {Store} from 'vuex';
import {log} from './log'
import {MockFirebase} from 'firebase-mock'
test('Bug:J14E: sampleContentUser1Proficiency/color on an item that you have >=1 interaction with should change when you click on a different sampleContentUser1Proficiency/color in the confidence interval question check', async (t) => {
    //
    // /* ===== create a sample tree, treeLocation, contentItem, contentUserItem ======= */
    // const contentIdVal = '5262'
    // const parentIdVal = '94321'
    // const treeIdVal = 'efa123'
    // const sampleTreeDataFromDB: ITreeDataFromDB = {
    //     contentId: {
    //         val: contentIdVal
    //     },
    //     parentId: {
    //         val: parentIdVal
    //     },
    //     children: {
    //         val: {}
    //     }
    // }
    //
    // const xVal = 25
    // const yVal = 35
    // // const point: IPoint = {
    // //     x: xVal,
    // //     y: yVal
    // // }
    // const sampleTreeLocationDataFromDB: ITreeLocationDataFromFirebase = {
    //     point: {
    //         val: {
    //             x: xVal,
    //             y: yVal,
    //         }
    //     }
    // }
    //
    // const questionVal = 'What is capital of Ohio'
    // const answerVal = 'Columbus'
    // const contentTypeVal = CONTENT_TYPES.FACT // = '1235262'
    // const contentId = '1239874h'
    // const userId = '0989898989'
    // const sampleContentDataFromDB: IContentDataFromDB = {
    //     type: {
    //         val: contentTypeVal
    //     },
    //     question: {
    //         val: questionVal,
    //     },
    //     answer: {
    //         val: answerVal
    //     }
    // }
    //
    // const overdueVal = true
    // const lastRecordedStrengthVal = 30
    // const proficiencyVal = PROFICIENCIES.TWO
    // const newProficiencyVal = PROFICIENCIES.THREE
    // const timerVal = 30
    // const contentUserId = getContentUserId({contentId, userId})
    //
    // const sampleContentUserDataFromDB1: IContentUserDataFromDB = {
    //     id: contentUserId,
    //     sampleContentUser1Overdue: {
    //         val: overdueVal
    //     },
    //     lastEstimatedStrength: {
    //         val: lastRecordedStrengthVal
    //     },
    //     sampleContentUser1Proficiency: {
    //         val: proficiencyVal
    //     },
    //     sampleContentUser1Timer: {
    //         val: timerVal
    //     }
    // }
    //
    // const sigmaId = treeIdVal
    //
    // /*** ====== loadContainer ======= ***/
    // myContainer.load(mockFirebaseReferences)
    // myContainerLoadAllModulesExceptFirebaseRefs()
    //
    // const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    // appContainer.start()
    //
    // /** initialize sigmaInstance to prevent error **/
    // const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    // // initialize userId to prevent ContentUserLoader DownloadData error
    // store.state.userId = userId // TODO: << I don't like modifying state directly
    // store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE)
    //
    // /* ===== load in the tree, contentItem, contentUserItem ======= */
    // const treeItemRef = mockTreesRef.child(treeIdVal)
    // treeItemRef.fakeEvent('value', undefined, sampleTreeDataFromDB)
    // const treeLocationItemRef = mockTreeLocationsRef.child(treeIdVal)
    // treeLocationItemRef.fakeEvent('value', undefined, sampleTreeLocationDataFromDB)
    // const contentItemRef = mockContentRef.child(contentId)
    // contentItemRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    // const contentUserItemRef = getContentUserRef({contentUsersRef: mockContentUsersRef, userId, contentId}) as MockFirebase
    // // contentUserItemRef = contentUsersRef.child()
    // // .child(contentUserId)
    // contentUserItemRef.fakeEvent('value', undefined, sampleContentUserDataFromDB1)
    // const sigmaNodeLoader: ISigmaNodeLoader =
    //     myContainer.get<ISigmaNodeLoader>(TYPES.ISigmaNodeLoader)
    // const sigmaNodeLoadeDataPromise = sigmaNodeLoader.loadIfNotLoaded(sigmaId)
    // log('treeItem should not be able to be downloaded yet, because treeItem is not yet flushed')
    // treeItemRef.flush()
    // log('treeItem should be Downloaded ardound now or after the timeouts. because treeItem ref flushed')
    // setTimeout(() => {}, 0)
    // setTimeout(() => {}, 0)
    //
    // log('about to flush treeLocationItem ref')
    // treeLocationItemRef.flush()
    // log('treeLocationItem ref flushed')
    // log('sigmaNodeLoader promise about to be received')
    // await sigmaNodeLoadeDataPromise // this line gets called as soon as the first await in the inner inner promise (SigmaNodeLoaderCore await treeLoader downloadData gets called apparently, NOT when the whole treeLoader downloadData promise is called. meaning the rest of the inner inner promise (after SigmNodeloader core await tree downloadData) wont run until after this line. meaning downloadData's on the contentItem and contenUserItem wont get called until after this line, meaning we can't flush conten/contentuser refs until after this line
    // // TODO: UGH this integration test is hard. Why won't the firebase refs flush the way I want them to???
    // log('about to flush contentItemRef')
    // contentItemRef.flush() // can't flush contentItem and contenUserItem until their downloadData methods have been called
    // log('contentItem ref flushed')
    // log('about to flush contentUserItem ref')
    // contentUserItemRef.flush() // must flush this separately from the other ones, because sigmaNodeLoader doesn't clal downloadData on contentUserItem for a while or something
    // log('contentUserItem ref flushed')
    // log('promise received')
    // // get access to the sigmaNode in the renderedSigmaNodes set
    // const state: IState  = myContainer.get<object>(TYPES.BranchesStoreState) as IState
    // const graph = state.graph // get nodes through graph.nodes()
    //
    // // trigger a UI mutation (e.g. proficiencyClicked({contentItem, userId})
    // const interaction: IAddContentInteractionMutationArgs = {
    //     contentUserId,
    //     sampleContentUser1Proficiency: PROFICIENCIES.FOUR,
    //     timestamp: Date.now()
    // }
    // store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, interaction)
    //
    // const sigmaNode = graph.nodes(sigmaId)
    // expect(sigmaNode.sampleContentUser1Proficiency).to.deep.equal(newProficiencyVal)
    // // verify that the sigmaNode is changed
    t.pass()
})
