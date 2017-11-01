"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLastNBreadcrumbsString(uri, n) {
    var sections = getURIWithoutRootElement(uri).split('/');
    var result = getLastNBreadcrumbsStringFromList(sections, n);
    return result;
}
exports.getLastNBreadcrumbsString = getLastNBreadcrumbsString;
function getURIWithoutRootElement(uri) {
    return uri.substring(uri.indexOf('/') + 1, uri.length);
}
exports.getURIWithoutRootElement = getURIWithoutRootElement;
function convertBreadcrumbListToString(breadcrumbList) {
    if (breadcrumbList.length <= 0) {
        return '';
    }
    var lastItem = decodeURIComponent(breadcrumbList.splice(-1));
    var firstItems = breadcrumbList.reduce(function (accum, val) {
        return accum + decodeURIComponent(val) + ' > ';
    }, '');
    var result = firstItems + lastItem;
    return result;
}
exports.convertBreadcrumbListToString = convertBreadcrumbListToString;
/**
 *
 * @param breadcrumbList - e.g. ["Everything", "Spanish%20Grammar", "Conjugating",
 * "Indicative%20Mood", "Present%20Tense", "-ar%20verbs", "3rd%20Person%20Singular"]
 * @returns {string}
 */
function getLastNBreadcrumbsStringFromList(breadcrumbList, n) {
    if (breadcrumbList.length <= n) {
        return convertBreadcrumbListToString(breadcrumbList);
    }
    var breadcrumbListCopy = breadcrumbList.slice();
    var lastNBreadcrumbSections = breadcrumbListCopy.splice(breadcrumbList.length - n, breadcrumbList.length);
    var result = convertBreadcrumbListToString(lastNBreadcrumbSections);
    return result;
}
exports.getLastNBreadcrumbsStringFromList = getLastNBreadcrumbsStringFromList;
