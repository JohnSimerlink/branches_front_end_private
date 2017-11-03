import md5 from 'md5';
import ContentItem from "./contentItem/contentItem";
import merge from 'lodash.merge'
import {Trees} from './trees'

export class Skill extends ContentItem {

    /**ParentTreeId is used in skill and heading constructor so as to avoid ambiguity when calculating the id of two different skills with the same title
     * e.g. Spanish > Grammar >Conjugating > Indicative Mood > Present Tense > -ar Verbs > 1st Person Plural
     * vs. e.g. Spanish > Grammar >Conjugating > Indicative Mood > Present Tense > -er Verbs > 1st Person Plural
     * ^^ Both skills are different, but have the same title: "1st Person Plural"
     * It is confusing that we are listing a tree id with the skill. Because skills and should be totally not related to what trees are using them. But for now I guess we will use the parentTreeId of the parent tree that was used to create the skill as a unique identifying mechanism
   */
    constructor (args /* ={title, primaryParentTreeId} */){
        // if (primaryParentTreeId){
        //     super({primaryParentTreeId})
        // } else {
        //     super()
        // }
        super(args)
        this.type = 'skill';

        this.title = args.title && args.title.trim();
        // this.calculateLongURI
        this.id = args.id || md5(JSON.stringify({title:this.title,primaryParentTreeId:args.primaryParentTreeId}));
        super.init()
    }

    getURIAddition(){
        return encodeURIComponent(this.title)
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

