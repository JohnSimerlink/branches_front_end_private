export class Fact {
  constructor (question, answer){
    this.question = question;
    this.answer = answer;
    this.id = md5(JSON.stringify({question: question, answer: answer}));
  }
}
