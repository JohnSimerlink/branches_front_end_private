import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'

export class Heading extends ContentItem {
    constructor (args /*={title, primaryParentTreeId} and more */){
        super(args)
        this.type = 'heading';

        this.title = args.title && args.title.trim();
        this.id = args.id || md5(JSON.stringify({title:this.title,primaryParentTreeId: args.primaryParentTreeId}));
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