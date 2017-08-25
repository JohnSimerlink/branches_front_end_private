import md5 from 'md5';
import ContentItem from "./contentItem";
import merge from 'lodash.merge'
import Exercise from './exercise'

export default class ExerciseQA extends Exercise {
    constructor ({contentItems, question, answer}){
        super({contentItems});
        this.type = 'QA';

        //question and answer can both be user generated HTML that can include image links to imgur - or I guess firebase stored images too
        this.question = question;
        this.answer = answer;
        this.id = md5(JSON.stringify({question, answer}));
        super.init()
    }

    getDBRepresentation(){
        var baseRep = super.getDBRepresentation()

        return merge(baseRep,
            {
                id: this.id,
                question: this.question,
                answer: this.answer,
                type: this.type,
            }
        )
    }
    static create({contentItems, question, answer}){
        const exerciseQA = new ExerciseQA({contentItems, question, answer})
        super.create(exerciseQA)
    }

}
