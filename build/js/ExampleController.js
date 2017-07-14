define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ExampleController = function ExampleController($scope, example) {
        _classCallCheck(this, ExampleController);

        $scope.example = example;
    };

    ExampleController.$inject = ['$scope', 'example'];

    exports.ExampleController = ExampleController;
});