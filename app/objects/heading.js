import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'

export class Heading extends ContentItem {
    constructor (args /*={title, initialParentTreeId} and more */){
        super(args)
        this.type = 'heading';

        this.title = args.title && args.title.trim();
        this.id = args.id || md5(JSON.stringify({title:this.title,initialParentTreeId: args.initialParentTreeId}));
        this.uri = this.initialParentTreeContentURI + "/" +encodeURIComponent(this.title)
        console.log('this heading uri for ', this, 'is ',this.uri)
        super.init()
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