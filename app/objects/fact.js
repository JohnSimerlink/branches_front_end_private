import md5 from 'md5';
import {ContentItem} from "./contentItem";


export class Fact extends ContentItem {
    constructor (question, answer) {
        super();
        this.contentType = 'fact';

        this.question = question;
        this.answer = answer;
        this.id = md5(JSON.stringify({question: question, answer: answer}));
        this.trees = {}
    }
}