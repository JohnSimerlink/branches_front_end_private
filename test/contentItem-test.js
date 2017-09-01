import {expect} from 'chai'
import {Trees} from '../app/objects/trees'
import ContentItems from '../app/objects/contentItems'
import DATA_KEYS from '../dataKeys'




describe('Get Breadcrumbs', () => {
    // it('should correctly get all the breadcrumb sections for Everyday Words Node in branches-dev 8/31 database', () => {
    //     let everydayWordsTreeNode = {}
    //     Trees.get(EVERYDAY_WORDS_TREE_ID).then(tree => {
    //         ContentItems.get(tree.contentId).then(contentItem => {
    //             const breadcrumbs = contentItem.getBreadCrumbs()
    //             //Everything > Spanish > Vocab > Everyday Words
    //             expect(breadcrumbs.length).to.equal(4)
    //         })
    //     })
    // })
})
describe('Get Last N Breadcrumbs', () => {
    it('should correctly get all the breadcrumb sections for Amar Node in branches-dev 8/31 database', () => {
        let everydayWordsTreeNode = {}
        return Trees.get(DATA_KEYS.TREE_IDS.AMAR).then(tree => {
            return ContentItems.get(tree.contentId).then(contentItem => {
                const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
                //Everything > Spanish > Vocab > Everyday Words
                expect(breadcrumbs).to.equal("Everything > Spanish Vocab > Everyday Words > amar:to love")
            })
        })
    })
    it('should correctly get all the breadcrumb sections for 1st Person Plural Node in branches-dev 8/31 database', () => {
        let everydayWordsTreeNode = {}
        return Trees.get(DATA_KEYS.TREE_IDS.FIRST_PERSON_PLURAL).then(tree => {
            return ContentItems.get(tree.contentId).then(contentItem => {
                const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
                //Everything > Spanish > Vocab > Everyday Words
                expect(breadcrumbs).to.equal("Indicative Mood > Present Tense > -ar verbs > 1st Person Singular")
            })
        })
    })
})
