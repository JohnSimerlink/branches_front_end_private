define(['exports', './fact.js', './firebaseService.js', './config.js', './globals.js'], function (exports, _factJs, _firebaseServiceJs, _configJs, _globalsJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.newFact = newFact;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _getFirebase = _interopRequireDefault(_firebaseServiceJs);

    function createAndWriteFactFromQA(question, answer) {
        var fact = new _factJs.Fact(question, answer);
        console.log('the fact just created is', fact);
        writeNewFact(fact);
        return fact;
    }
    function writeNewFact(fact) {
        console.log('THE FACT BEEING CREATED IN NEWFACT.JS is ', fact);
        var firebase = (0, _getFirebase['default'])();
        var updates = {};
        updates['/facts/' + fact.id] = fact;
        console.log('inside of write new fact: firebase is', firebase, 'fb.db is', firebase.database());
        firebase.database().ref().update(updates);
    }

    function newFact(event) {
        var question = document.querySelector('#newTreeQuestion').value;
        var answer = document.querySelector('#newTreeAnswer').value;
        var fact = createAndWriteFactFromQA(question, answer);
        return fact;
    }
});