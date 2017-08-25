import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'
import {Trees} from './trees'

export class Skill extends ContentItem {

    /**ParentTreeId is used in skill and heading constructor so as to avoid ambiguity when calculating the id of two different skills with the same title
     * e.g. Spanish > Grammar >Conjugating > Indicative Mood > Present Tense > -ar Verbs > 1st Person Plural
     * vs. e.g. Spanish > Grammar >Conjugating > Indicative Mood > Present Tense > -er Verbs > 1st Person Plural
     * ^^ Both skills are different, but have the same title: "1st Person Plural"
     * It is confusing that we are listing a tree id with the skill. Because skills and should be totally not related to what trees are using them. But for now I guess we will use the parentTreeId of the parent tree that was used to create the skill as a unique identifying mechanism
   */
    constructor ({title, initialParentTreeId}){
        if (initialParentTreeId){
            super({initialParentTreeId})
        } else {
            super()
        }
        this.type = 'skill';

        this.title = title;
        // this.calculateLongURI
        this.id = md5(JSON.stringify({title,initialParentTreeId}));
        super.init()
    }
    //returns a promise and stores value in db
    calculateURI(){
        console.log('SKILL: this.calculateURI called for ', this)
        calculateURI_skill_or_heading.call(this)
    }

    getDBRepresentation(){
        var baseRep = super.getDBRepresentation()

        return merge(baseRep,
            {
                id: this.id,
                title: this.title,
                type: this.type,
            }
        )
    }
}

export function calculateURI_skill_or_heading(){

    const me = this
    return new Promise((resolve, reject) => {
        if (me.uri){
            resolve(uri) //property already calculated - no need to save it in dbh
        } else {
            Trees.get(me.initialParentTreeId).then(parentTree => {
                ContentItem.get(parentTree.contentId).then(parentContentItem => {
                    let uri;
                    parentContentItem.calculateURI().then(parentURI => {
                        uri = parentURI + "/" + me.title
                        me.setProperty('uri',uri)
                        console.log('the uri calculated for ',this, ' is', uri)
                        resolve(uri)
                    })
                })
            })
        }
    })
}
