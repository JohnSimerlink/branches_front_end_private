import {Fact} from "./fact";
import {Skill} from "./skill";
import {Heading} from "./heading";

const factsAndSkills = {}
const content = {}
function createContentItemFromData(contentData, contentDatumKey){
    let contentItem

    switch(contentData.type){
        case 'fact':
            contentItem = new Fact(contentData)
            factsAndSkills[contentItem.id] = contentItem
            break;
        case 'skill':
            contentItem = new Skill(contentData)
            factsAndSkills[contentItem.id] = contentItem
            break;
        case 'heading':
            contentItem = new Heading(contentData)
            break;
        default:
            console.error(//bc there was some corrupted data
                'NO TYPE DETECTED for contentData', contentData, contentDatumKey
            )
            contentItem = new Fact(contentData)
            break;
    }
    contentItem.init() // post constructor

    content[contentItem.id] = contentItem // add to cache
    return contentItem
}
export default class ContentItems {
    static get(contentId) {
        if(!contentId){
            throw "Content.get(contentId) error! contentId empty!"
        }
        return new Promise((resolve, reject) => {
            if (content[contentId]){
                resolve(content[contentId])
            } else {
                firebase.database().ref('content/' + contentId).once("value", function(snapshot){
                    const contentData = snapshot.val()
                    let contentItem = createContentItemFromData(contentData)
                    resolve(contentItem)
                }, reject)
            }
        })
    }
    static getAll() {
        return new Promise((resolve, reject) => {
            firebase.database().ref('content/').once("value", function(snapshot){
                const contentData = snapshot.val()
                Object.keys(contentData).filter(contentDatumKey => {
                    const uri = contentData[contentDatumKey].uri
                    if (!uri || uri.indexOf("null") == 0 ) { //old/corrupted data that I couldn't figure out how to quickly delete from the db, so we are just filtering it
                        return false
                    }
                    return true
                }).
                forEach(contentDatumKey => {
                    const contentDatum = contentData[contentDatumKey]
                    if (!contentDatum) return // in case contentDatum is undefined which has happened before
                    let contentItem = createContentItemFromData(contentDatum,contentDatumKey)
                })
                resolve(content) //the cache containing all
            }, reject)
        })
    }
    static getAllExceptForHeadings() {
        function processSnapshot(snapshot, resolve){
            const contentData = snapshot.val()
            Object.keys(contentData).filter(contentDatumKey => {
                const uri = contentData[contentDatumKey].uri
                if (!uri || uri.indexOf("null") == 0 ) { //old/corrupted data that I couldn't figure out how to quickly delete from the db, so we are just filtering it
                    return false
                }
                return true
            }).
            forEach(contentDatumKey => {
                const contentDatum = contentData[contentDatumKey]
                if (!contentDatum) return // in case contentDatum is undefined which has happened before
                let contentItem = createContentItemFromData(contentDatum,contentDatumKey)
            })
            // resolve(content) //the cache containing all
        }
        return new Promise((resolve, reject) => {
            const skillPromise = firebase.database().ref('content/').orderByChild('type').equalTo('skill').once("value", function(snapshot){
                processSnapshot(snapshot, resolve)
            }, reject)
            const factPromise = firebase.database().ref('content/').orderByChild('type').equalTo('fact').once("value", function(snapshot){
                processSnapshot(snapshot, resolve)
            }, reject)
            Promise.all([skillPromise, factPromise]).then( () => {
                resolve(factsAndSkills)
            })
        })
    }

    /**
     * Create a new content object in the database
     * @param contentItem
     * @returns newly created contentItem
     */
    static create(contentItem) {
        let updates = {};
        updates['/content/' + contentItem.id] = contentItem.getDBRepresentation();
        firebase.database().ref().update(updates);
        return contentItem;
    }
}

if (typeof window !== 'undefined') {
    window.ContentItems = ContentItems
}