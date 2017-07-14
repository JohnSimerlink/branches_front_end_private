define(["exports", "angular", "angularMocks", "../js/Example", "../js/ExampleController"], function (exports, _angular, _angularMocks, _jsExample, _jsExampleController) {
    'use strict';

    describe('ExampleController', function () {
        var scope, ctrl, example;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope.$new();
            example = new _jsExample.Example();
            ctrl = new _jsExampleController.ExampleController(scope, example);
        }));

        it('takes an example and puts it on the scope', function () {
            expect(scope.example).toEqual(example);
        });
    });
});