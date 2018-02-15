const uriContentMap = {} //cache
if (typeof window !== 'undefined'){
    window.uriContentMap = uriContentMap
}
//URI contentId sourceMap
export default class UriContentMap {
    static get(uri) {
        uri = 'null/Everything' + uri
        uri = stripTrailingSlash(uri)
        if(!uri){
            throw "UriContentMap.get(uri) error! uri empty!"
        }
        console.log('uri content sourceMap get is', uri)
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
        console.log("uriContentMap.set called!", ...arguments)
        const updates = {}
        uriContentMap[uri] = contentId
        try {
            const base64uri = btoa(uri)
            updates[base64uri] = contentId
            firebase.database().ref('uriContentMap').update(updates)

        } catch (err) {
            console.error('uriContentMap.set error', err, updates)
        }
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