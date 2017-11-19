Object.defineProperty(exports, "__esModule", { value: true });
var uriParser_1 = require("../app/objects/contentItem/uriParser");
var chai_1 = require("chai");
describe('Convert Breadcrumbs List to String', function () {
    var list;
    var expectedBreadcrumbs;
    list = ['a', 'b', 'c'];
    expectedBreadcrumbs = 'a > b > c';
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.convertBreadcrumbListToString(list);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
    expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love';
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.convertBreadcrumbListToString(list);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = [];
    expectedBreadcrumbs = '';
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.convertBreadcrumbListToString(list);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
});
describe('Last N BreadCrumbs String From List', function () {
    var list, expectedBreadcrumbs, n;
    list = ['a', 'b', 'c'];
    expectedBreadcrumbs = 'b > c';
    n = 2;
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['a', 'b', 'c'];
    expectedBreadcrumbs = 'a > b > c';
    n = 4;
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['a', 'b', 'c'];
    expectedBreadcrumbs = 'c';
    n = 1;
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['a', 'b', 'c'];
    expectedBreadcrumbs = '';
    n = 0;
    it('should convert ' + list.toString() + ', ' + n + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
    expectedBreadcrumbs = 'Everything > Spanish > Vocab > amar : to love';
    n = 4;
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = ['Everything', 'Spanish', 'Vocab', 'amar : to love'];
    expectedBreadcrumbs = 'Spanish > Vocab > amar : to love';
    n = 3;
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
    list = [];
    expectedBreadcrumbs = '';
    it('should convert ' + list.toString() + ' to ' + expectedBreadcrumbs, function () {
        var breadcrumbs = uriParser_1.getLastNBreadcrumbsStringFromList(list, n);
        chai_1.expect(breadcrumbs).to.equal(expectedBreadcrumbs);
    });
});
