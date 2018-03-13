import {IHash} from '../objects/interfaces';

export function stripTrailingSlash(uri) {
    if (!uri || !uri.length) {
        return uri
    }
    const hasTrailingSlash = uri.substring(uri.length - 1, uri.length) === '/';
    if (hasTrailingSlash) {
        uri = uri.substring(0, uri.length - 1)
    }
    return uri
}

export function stringArrayToSet(array: string[]): IHash<boolean> {
    return array.reduce((set, item) => {
        set[item] = true;
        return set
    }, {})
}
export function setToStringArray(set: IHash<boolean>): string[] {
    return Object.keys(set).reduce( (arr, id) => {
        if (set[id]) {
            arr.push(id)
        }
        return arr
    }, [])
}

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on:
 * http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
export function makeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) { return promise }

    // Set initial state
    let isPending = true;
    let isRejected = false;
    let isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    const result = promise.then(
        v => {
            isFulfilled = true;
            isPending = false;
            return v;
        },
        e => {
            isRejected = true;
            isPending = false;
            throw e;
        }
    );

    result.isFulfilled = () => isFulfilled;
    result.isPending = () => isPending;
    result.isRejected = () => isRejected;
    return result;
}
