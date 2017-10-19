const uriContentMap = {} //cache
if (typeof window !== 'undefined'){
    window.uriContentMap = uriContentMap
}
//URI contentId map
export default class UriContentMap {
    static get(uri) {
        uri = 'null/Everything' + uri
        uri = stripTrailingSlash(uri)
        if(!uri){
            throw "UriContentMap.get(uri) error! uri empty!"
        }
        console.log('uri content map get is', uri)
        return new Promise((resolve, reject) => {
            if (uriContentMap[uri]){
                resolve(uriContentMap[uri])
            } else {
                const base64uri = btoa(uri)
                const lookupKey = 'uriContentMap/' + base64uri
                console.log("lookupKey is", lookupKey)
                firebase.database().ref(lookupKey).once("value", function(snapshot){
                    const contentId = snapshot.val()
                    uriContentMap[uri] = contentId // add to cache
                    resolve(contentId)
                }, reject)
            }
        })
    }
    static set(uri, contentId){

        uriContentMap[uri] = contentId
        const base64uri = btoa(uri)
        const updates = {}
        updates[base64uri] = contentId
        firebase.database().ref('uriContentMap').update(updates)
    }
}

export function stripTrailingSlash(uri){
    if (!uri || !uri.length) return uri
    const hasTrailingSlash = uri.substring(uri.length - 1, uri.length) === '/'
    if (hasTrailingSlash){
        uri = uri.substring(0, uri.length - 1)
    }
    return uri
}