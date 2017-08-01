import md5 from 'md5';
import user from './user'
import firebase from './firebaseService'
import ContentItem from './contentItem'// from './firebaseService'
export class Fact extends ContentItem {
  //constructor is used when LOADING facts from db or when CREATING facts from Facts.create
  constructor ({question, answer, id, userTimeMap, trees}){
    super()
    this.type = 'fact'
    this.question = question;
    this.answer = answer;
    this.id = id || md5(JSON.stringify({question: question, answer: answer}));
    this.trees = {}


    if(window.facts && !window.facts[id]) window.facts[id] = this; //TODO: john figure out what this does
  }

  //bc certain properties used in the local js object in memory, shouldn't be stored in the db

    getDBRepresentation(){
        return {
            id: this.id,
            question: this.question,
            answer: this.answer,
            trees: this.trees,
            userTimeMap: this.userTimeMap
        }
    }
}
