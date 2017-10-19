import {convertBreadcrumbListToString} from "../app/objects/contentItem/uriParser";
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
