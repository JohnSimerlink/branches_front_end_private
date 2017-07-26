import md5 from 'md5';
export class Fact {
  constructor (question, answer){
    this.question = question;
    this.answer = answer;
    this.id = md5(JSON.stringify({question: question, answer: answer}));
    this.trees = {}
  }
  addTree(treeId){
    this.trees[treeId] = true
    var trees = {}
    trees[treeId] = true
    var updates = {
      trees
    }
    firebase.database().ref('facts/' +this.id).update(updates)
  }

}
