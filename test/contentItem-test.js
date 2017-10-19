var cleanup = require('jsdom-global')()
import {expect} from 'chai'

// import {Trees} from '../app/objects/trees'
// import ContentItems from '../app/objects/contentItems'
// import DATA_KEYS from '../dataKeys'




describe('Get Breadcrumbs', () => {
    // it('should correctly get all the breadcrumb sections for Everyday Words Node in branches-dev 10/31 database', () => {
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
// describe('Breadcrumb', () => {
//     it('should correctly get all the breadcrumb sections for Amar Node in branches-dev 9/17 database', () => {
//         let everydayWordsTreeNode = {}
//         return Trees.get(DATA_KEYS.TREE_IDS.AMAR).then(tree => {
//             return ContentItems.get(tree.contentId).then(contentItem => {
//                 const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
//                 //Everything > Spanish > Vocab > Everyday Words
//                 try {
//                     expect(breadcrumbs).to.equal("Vocab > Nouns > Everyday Words > amar:to love")
//                 } catch(err) {
//                     console.error("there was an error", err)
//                 }
//             })
//         })
//     })
//     it('should correctly get all the breadcrumb sections as an array of objects for Amar Node in branches-dev 9/17 database', () => {
//         let everydayWordsTreeNode = {}
//         return Trees.get(DATA_KEYS.TREE_IDS.AMAR).then(tree => {
//             return ContentItems.get(tree.contentId).then(contentItem => {
//                 const breadcrumbs = contentItem.getBreadcrumbsObjArray()
//                 //Everything > Spanish > Vocab > Everyday Words
//                 try {
//                     expect(breadcrumbs.length).to.equal(5)//"Everything > Spanish > Vocab > Everyday Words > amar:to love")
//                     expect(breadcrumbs[0].text).to.equal("Spanish")
//                     expect(breadcrumbs[1].text).to.equal("Vocab")
//                     expect(breadcrumbs[2].text).to.equal("Nouns")
//                     expect(breadcrumbs[3].text).to.equal("Everyday Words")
//                     expect(breadcrumbs[4].text).to.equal("amar:to love")
//                 } catch(err) {
//                     console.error("there was an error", err)
//                 }
//             })
//         })
//     })
//     it('should correctly get all the breadcrumb sections for 1st Person Plural Node in branches-dev 9/17 database', () => {
//         let everydayWordsTreeNode = {}
//         return Trees.get(DATA_KEYS.TREE_IDS.FIRST_PERSON_PLURAL).then(tree => {
//             return ContentItems.get(tree.contentId).then(contentItem => {
//                 const breadcrumbs = contentItem.getLastNBreadcrumbsString(4)
//                 //Everything > Spanish > Vocab > Everyday Words
//                 try {
//                     expect(breadcrumbs.length).to.equal("Present Tense > -ar verbs > Spanish To English > 1st Person Plural".length)
//                     expect(breadcrumbs).to.equal("Present Tense > -ar verbs > Spanish to English > 1st Person Plural")
//                 } catch(err) {
//                     console.error("there was an error", err)
//                 }
//             })
//         })
//     })
// })
//
cleanup()
