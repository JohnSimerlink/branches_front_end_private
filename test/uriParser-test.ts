import {convertBreadcrumbListToString, getLastNBreadcrumbsStringFromList} from '../app/objects/contentItem/uriParser';
import {expect} from 'chai'
describe('Convert Breadcrumbs List to String', () => {
    let list
    let expectedBreadcrumbs
    list = ['a', 'b', 'c']
    expectedBreadcrumbs = 'a > b > c'
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love'
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = []
    expectedBreadcrumbs = ''
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = convertBreadcrumbListToString(list)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })
})
describe('Last N BreadCrumbs String From List', () => {
    let list, expectedBreadcrumbs, n
    list = ['a', 'b' , 'c']
    expectedBreadcrumbs = 'b > c'
    n = 2
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })
    list = ['a', 'b', 'c']
    expectedBreadcrumbs = 'a > b > c'
    n = 4
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = ['a', 'b', 'c']
    expectedBreadcrumbs = 'c'
    n = 1
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = ['a', 'b', 'c']
    expectedBreadcrumbs = ''
    n =  0
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })


    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love'
    n =  4
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love']
    expectedBreadcrumbs = 'Spanish > Vocab > amar : to love'
    n =  3
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })

    list = []
    expectedBreadcrumbs = ''
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, () => {
        const breadcrumbs = getLastNBreadcrumbsStringFromList(list, n)
        expect(breadcrumbs).to.equal(expectedBreadcrumbs)
    })
})
