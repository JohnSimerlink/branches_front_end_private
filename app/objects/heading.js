import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'
import {calculateURI_skill_or_heading} from "./skill";

export class Heading extends ContentItem {
    constructor ({title, initialParentTreeId}){
        if (initialParentTreeId){
            super({initialParentTreeId})
        } else {
            super()
        }
        this.type = 'heading';

        this.title = title;
        this.id = md5(JSON.stringify({title,initialParentTreeId}));
        super.init()
    }
    calculateURI(){
        console.log('HEADING: this.calculateURI called for ', this)
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