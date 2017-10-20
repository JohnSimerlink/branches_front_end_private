import {convertBreadcrumbListToString, getLastNBreadcrumbsStringFromList} from "../app/objects/contentItem/uriParser.ts";
import {expect} from 'chai'
describe('Convert Breadcrumbs List to String', () => {
    let list, expectedBreadcrumbs
    list = ['a','b','c']
    expectedBreadcrumbs = "a > b > c"
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })

    list = ['Everything','Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = "Everything > Spanish > Vocab > amar : to love"
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })

    list = []
    expectedBreadcrumbs = ""
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })
})
describe('Last N BreadCrumbs String From List', () => {
    let list, expectedBreadcrumbs, n
    list = ['a','b','c']
    expectedBreadcrumbs = "b > c"
    n = 2
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)

        } catch (err) {
            console.error("there was an error", err)
            return false
        }
    })
    list = ['a','b','c']
    expectedBreadcrumbs = "a > b > c"
    n = 4
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
            return false
        }
    })

    list = ['a','b','c']
    expectedBreadcrumbs = "c"
    n = 1
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })

    list = ['a','b','c']
    expectedBreadcrumbs = ""
    n =  0
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })


    list = ['Everything','Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = "Everything > Spanish > Vocab > amar : to love"
    n =  4
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })

    list = ['Everything','Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = "Spanish > Vocab > amar : to love"
    n =  3
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })

    list = []
    expectedBreadcrumbs = ""
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        try {
            expect(breadcrumbs).to.equal(expectedBreadcrumbs)
        } catch (err) {
            console.error("there was an error", err)
        }
    })
})
