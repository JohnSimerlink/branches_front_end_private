import md5 from 'md5';
import ContentItem from "./contentItem";


export class Heading extends ContentItem {

    constructor ({title}){
        super();
        this.type = 'heading';

        this.title = title;
        this.id = md5(JSON.stringify({title}));
        this.trees = {}
    }

}