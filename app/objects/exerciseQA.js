import md5 from 'md5';
import ContentItem from "./contentItem/contentItem";
import merge from 'lodash.merge'
import Exercise from './exercise'

export default class ExerciseQA extends Exercise {
    constructor ({contentItemIds, question, answer}){
        super({contentItemIds});
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

    static create({contentItemIds, question, answer}){
        const exerciseQA = new ExerciseQA({contentItemIds, question, answer})
        return super.create(exerciseQA)
    }
    editQuestion(){
        //create new exercise

        //remove old exercise from any locations it was in - except user interactions
            //as a property under certain contentItems

        //add modified exercise to any locations it belongs in
    }

}
