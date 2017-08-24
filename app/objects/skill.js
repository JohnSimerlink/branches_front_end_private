import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'

export class Skill extends ContentItem {

    constructor ({title}){
        super();
        this.type = 'skill';

        this.title = title;
        this.id = md5(JSON.stringify({title}));
        super.init()
    }
    getDBRepresentation(){
        var baseRep = super.getDBRepresentation()

        return merge(baseRep,
            {
                id: this.id,
                title: this.title,
                type: this.skill,
            }
        )
    }

}
