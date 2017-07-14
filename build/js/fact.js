define(['exports', 'md5'], function (exports, _md5) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _md52 = _interopRequireDefault(_md5);

  var Fact = function Fact(question, answer) {
    _classCallCheck(this, Fact);

    this.question = question;
    this.answer = answer;
    this.id = (0, _md52['default'])(JSON.stringify({ question: question, answer: answer }));
  };

  exports.Fact = Fact;
});