define(['exports', 'module', 'firebase', './firebase.dev.config.json'], function (exports, module, _firebase, _firebaseDevConfigJson) {
  'use strict';

  module.exports = getFirebase;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _firebaseDevConfig = _interopRequireDefault(_firebaseDevConfigJson);

  function firebaseInitialized() {
    return _firebase.apps.length !== 0;
  }
  function initializeFirebase() {
    _firebase.initializeApp(_firebaseDevConfig['default']);
    window.firebase = _firebase;
  }

  function getFirebase() {
    // console.log('get firebase called');
    if (!firebaseInitialized()) {
      initializeFirebase();
    }
    return _firebase; //TODO: initfirebase might actually be async
  }
});