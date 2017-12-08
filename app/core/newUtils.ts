export function stripTrailingSlash(uri) {
    if (!uri || !uri.length) return uri
    const hasTrailingSlash = uri.substring(uri.length - 1, uri.length) === '/'
    if (hasTrailingSlash) {
        uri = uri.substring(0, uri.length - 1)
    }
    return uri
}
