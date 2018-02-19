import test from 'ava'
import {expect} from 'chai'
import {MutableSubscribableField} from '../objects/field/MutableSubscribableField';
import {SubscribableMutableStringSet} from '../objects/set/SubscribableMutableStringSet';
import {SubscribableTree} from '../objects/tree/SubscribableTree';
import {
    CONTENT_TYPES, IAddContentInteractionMutationArgs, IContentDataFromDB, IContentUserData, IContentUserDataFromDB,
    ISigmaNodeLoader, IState,
    ITreeDataFromFirebase
} from '../objects/interfaces';
import {PROFICIENCIES} from '../objects/proficiency/proficiencyEnum';
import {getContentUserId} from '../loaders/contentUser/ContentUserLoaderUtils';
import {partialInject} from '../testHelpers/partialInject';
import {
    mockContentRef, mockFirebaseReferences, mockTreesRef, myContainer,
    myContainerLoadAllModulesExceptFirebaseRefs
} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {AppContainer} from './appContainer';
import BranchesStore, {MUTATION_NAMES} from './store2';
import {Store} from 'vuex';
test('Bug:J14E: proficiency/color on an item that you have >=1 interaction with should change when you click on a different proficiency/color in the confidence interval question check', t => {

    /* ===== create a sample tree, contentItem, contentUserItem ======= */
    const contentIdVal = '5262'
    const parentIdVal = '94321'
    const treeIdVal = 'efa123'
    const sampleTreeDataFromDB: ITreeDataFromFirebase = {
        contentId: {
            val: contentIdVal
        },
        parentId: {
            val: parentIdVal
        },
        children: {
            val: {}
        }
    }

    const questionVal = 'What is capital of Ohio'
    const answerVal = 'Columbus'
    const contentTypeVal = CONTENT_TYPES.FACT // = '1235262'
    const contentId = '1239874h'
    const userId = '0989898989'
    const sampleContentDataFromDB: IContentDataFromDB = {
        type: {
            val: contentTypeVal
        },
        question: {
            val: questionVal,
        },
        answer: {
            val: answerVal
        }
    }

    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const newProficiencyVal = PROFICIENCIES.THREE
    const timerVal = 30
    const contentUserId = getContentUserId({contentId, userId})

    const sampleContentUserDataFromDB: IContentUserDataFromDB = {
        id: contentUserId,
        overdue: {
            val: overdueVal
        },
        lastRecordedStrength: {
            val: lastRecordedStrengthVal
        },
        proficiency: {
            val: proficiencyVal
        },
        timer: {
            val: timerVal
        }
    }

    const sigmaId = treeIdVal

    /*** ====== loadContainer ======= ***/
    myContainer.load(mockFirebaseReferences)
    myContainerLoadAllModulesExceptFirebaseRefs()

    const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
    appContainer.start()
    /* ===== load in the tree, contentItem, contentUserItem ======= */
    const sigmaNodeLoader: ISigmaNodeLoader =
        myContainer.get<ISigmaNodeLoader>(TYPES.ISigmaNodeLoader)
    sigmaNodeLoader.loadIfNotLoaded(sigmaId)
    const treeItemRef = mockTreesRef.child(treeIdVal)
    treeItemRef.fakeEvent('value', undefined, sampleTreeDataFromDB)
    treeItemRef.flush()
    const contentItemRef = mockContentRef.child(contentId)
    contentItemRef.fakeEvent('value', undefined, sampleContentDataFromDB)
    contentItemRef.flush()
    const contentUserItemRef = mockContentRef.child(contentId)
    contentUserItemRef.fakeEvent('value', undefined, sampleContentUserDataFromDB)
    contentUserItemRef.flush()
    // get access to the sigmaNode in the renderedSigmaNodes set
    const state: IState  = myContainer.get<object>(TYPES.BranchesStoreState) as IState
    const graph = state.graph // get nodes through graph.nodes()

    // trigger a UI mutation (e.g. proficiencyClicked({contentItem, userId})
    const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>
    const interaction: IAddContentInteractionMutationArgs = {
        contentUserId,
        proficiency: PROFICIENCIES.FOUR,
        timestamp: Date.now()
    }
    store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, interaction)

    const sigmaNode = graph.nodes(sigmaId)
    expect(sigmaNode.proficiency).to.deep.equal(newProficiencyVal)
    // verify that the sigmaNode is changed
    t.pass()
})
