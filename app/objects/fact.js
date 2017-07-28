import md5 from 'md5';
import {ContentItem} from "./contentItem";
import firebase from './firebaseService'
import user from './user'

window.facts = {};
export class Fact extends ContentItem {
    constructor (question, answer, id, usersTimeMap) {
        super();
        this.contentType = 'fact';


        this.question = question;
        this.answer = answer;
        this.id = id || md5(JSON.stringify({question: question, answer: answer}));
        this.trees = {};

        this.usersTimeMap = usersTimeMap || {} ;
        this.timeElapsedForCurrentUser = user.loggedIn && this.usersTimeMap && this.usersTimeMap[user.getId()] || 0;
        this.timerId = null;
        if (!window.facts[id]) window.facts[id] = this;
    }
    updateWithUserInfo() {//in case the card was loaded before the user logged in and userTimeElapsed is just a 0 when it actually isnt in the db
        this.timeElapsed = user.loggedIn && usersTimeMap[user.getId()] || 0
    }
    getDBRepresentation(){
        return {
            id: this.id,
            question: this.question,
            answer: this.answer,
            trees: this.trees,
            usersTimeMap: this.usersTimeMap
        }
    }

    continueTimer(){
        if (!user.loggedIn) return;
        const self = this;
        this.timerId = setInterval(()=>{
            self.timeElapsedForCurrentUser++;
            console.log('timeElapsedForCurrent user is', self.timeElapsedForCurrentUser)
        },1000);

        console.log("timerid is " + this.timerId);
    }

    pauseTimer() {
        console.log("PAUSE" + this.timerId);
        if (!user.loggedIn) return;
        console.log('all facts within fact.js pauseTimer is . . . . .');
        firebase.database().ref('content/' + this.id).on('value', function(snapshot) {
            console.log('snapshot of fact within fact.js pauseTimer is', snapshot.val())
        });

        clearInterval(this.timerId);
        this.usersTimeMap[user.getId()] = this.timeElapsedForCurrentUser

        var updates = {
            usersTimeMap: this.usersTimeMap
        };
        console.log('pause timer called for ',this.id, user.getId(), updates)
        firebase.database().ref('content/' + this.id).update(updates)
    }




}

