import {expect} from 'chai'
import {Trees} from '../app/objects/trees'
import ContentItems from '../app/objects/contentItems'

const EVERYDAY_WORDS_TREE_ID = 'd739bbe3d09aa564f92d69e1ef3093f5'
const AMAR_TREE_ID= '83cbe6ea3fa874449982b645f04d14a1'
const FIRST_PERSON_PLURAL_ID ='efb44586e0ffc019548f2e4dc73e9236'



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
        return Trees.get(AMAR_TREE_ID).then(tree => {
            return ContentItems.get(tree.contentId).then(contentItem => {
                const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
                //Everything > Spanish > Vocab > Everyday Words
                expect(breadcrumbs).to.equal("Everything > Spanish Vocab > Everyday Words > amar:to love")
            })
        })
    })
    it('should correctly get all the breadcrumb sections for 1st Person Plural Node in branches-dev 8/31 database', () => {
        let everydayWordsTreeNode = {}
        return Trees.get(FIRST_PERSON_PLURAL_ID).then(tree => {
            return ContentItems.get(tree.contentId).then(contentItem => {
                const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
                //Everything > Spanish > Vocab > Everyday Words
                expect(breadcrumbs).to.equal("Indicative Mood > Present Tense > -ar verbs > 1st Person Singular")
            })
        })
    })
})
