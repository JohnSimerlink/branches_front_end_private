function getLastNBreadcrumbsString(uri, n){

}
function getURIWIthoutRootElement(uri){

}
function getLastNBreadcrumbsStringFromList(breadcrumbsList, n){

}

export function convertBreadcrumbListToString(breadcrumbList){
    if (breadcrumbList.length <= 0) return ""

    const lastItem = decodeURIComponent(breadcrumbList.splice(-1))

    let firstItems =
        breadcrumbList.reduce((accum, val) => {
            return accum + decodeURIComponent(val) + " > "
        },'')
    let result = firstItems + lastItem

    return result
}
