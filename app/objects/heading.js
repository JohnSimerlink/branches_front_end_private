import md5 from 'md5';
import {ContentItem} from "./contentItem";


export class Heading extends ContentItem {

    constructor (text){
        super();
        this.contentType = 'heading';

        this.title = text;
        this.id = md5(JSON.stringify({text}));
        this.trees = {}
    }

}