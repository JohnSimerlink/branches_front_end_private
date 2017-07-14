define(["exports", "angular", "angularMocks", "../js/Example", "../js/ExampleController"], function (exports, _angular, _angularMocks, _jsExample, _jsExampleController) {
    'use strict';

    describe('Northern Growing Tree', function () {
        var scope, ctrl, example;
        // var offset = 100
        // var point = new Point(1000,1000)
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