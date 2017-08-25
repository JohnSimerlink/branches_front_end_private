import md5 from 'md5';
import user from './user'
import firebase from './firebaseService'
import merge from 'lodash.merge'
import ContentItem from './contentItem'// from './firebaseService'
export class Fact extends ContentItem {
  //constructor is used when LOADING facts from db or when CREATING facts from Facts.create
  constructor ({question, answer, id, userTimeMap, initialParentTreeId}){
      if (initialParentTreeId){
          super({initialParentTreeId})
      } else {
          super()
      }
    this.type = 'fact'
    this.question = question;
    this.answer = answer;
    this.id = id || md5(JSON.stringify({question, answer}));
    this.initialParentTreeId = initialParentTreeId

    if(window.facts && !window.facts[id]) window.facts[id] = this; //TODO: john figure out what this does
    super.init()
  }

  calculateURI(){
      const me = this
      console.log('FACT: this.calculateURI called for ', this)
      return new Promise((resolve, reject) => {
          if (me.uri){
              resolve(uri) //property already calculated - no need to save it in dbh
          } else {
              Trees.get(me.parentTreeId).then(parentTree => {
                  ContentItem.get(parentTree.contentId).then(parentContentItem => {
                      let uri;
                      parentContentItem.calculateURI().then(parentURI => {
                          uri = parentURI + "/" + me.title
                          me.setProperty('uri',uri)
                          resolve(uri)
                      })
                  })
              })
          }
      })
  }
  //bc certain properties used in the local js object in memory, shouldn't be stored in the db

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
}
