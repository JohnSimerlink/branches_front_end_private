define(['exports', './App.vue', 'vuefire', 'vue'], function (exports, _AppVue, _vuefire, _vue) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _App = _interopRequireDefault(_AppVue);

  var _VueFire = _interopRequireDefault(_vuefire);

  var _Vue = _interopRequireDefault(_vue);

  _Vue['default'].use(_VueFire['default']);

  new _Vue['default']({ el: '#bootstrap', render: function render(h) {
      return h(_App['default']);
    } });
});