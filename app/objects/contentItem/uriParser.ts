function getLastNBreadcrumbsString(uri, n) {
    return true
}
function getURIWIthoutRootElement(uri) {
    return true
}
export function convertBreadcrumbListToString(breadcrumbList) {
    if (breadcrumbList.length <= 0) {
      return ""
    }

    const lastItem = decodeURIComponent(breadcrumbList.splice(-1))

    const firstItems =
        breadcrumbList.reduce((accum, val) => {
            return accum + decodeURIComponent(val) + " > "
        },'')
    const result = firstItems + lastItem

    return result
}

/**
 *
 * @param breadcrumbList - e.g. ["Everything", "Spanish%20Grammar", "Conjugating",
 * "Indicative%20Mood", "Present%20Tense", "-ar%20verbs", "3rd%20Person%20Singular"]
 * @returns {string}
 */
export function getLastNBreadcrumbsStringFromList(breadcrumbList, n) {
    if (breadcrumbList.length <= n) {
        return breadcrumbList
    }

    const breadcrumbListCopy = breadcrumbList.slice()
    const lastNBreadcrumbSections = breadcrumbListCopy.splice(breadcrumbList.length - n, breadcrumbList.length)
    const result = convertBreadcrumbListToString(lastNBreadcrumbSections)

    return result
}
