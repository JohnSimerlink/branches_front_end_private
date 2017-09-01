import {expect} from 'chai'
import {Trees} from '../app/objects/trees'
import ContentItems from '../app/objects/contentItems'

const EVERYDAY_WORDS_TREE_ID = 'd739bbe3d09aa564f92d69e1ef3093f5'

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
    it('should correctly get all the breadcrumb sections for Everyday Words Node in branches-dev 8/31 database', () => {
        let everydayWordsTreeNode = {}
        return Trees.get(EVERYDAY_WORDS_TREE_ID).then(tree => {
            return ContentItems.get(tree.contentId).then(contentItem => {
                const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
                //Everything > Spanish > Vocab > Everyday Words
                expect(breadcrumbs).to.equal("Hello World 1234")
            })
        })
    })
})
