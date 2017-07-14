'use strict';

import * as angular from "angular";
import * as mock from "angularMocks";
import { Example } from '../js/Example';
import { ExampleController } from '../js/ExampleController';

describe('Northern Growing Tree', function() {
    var scope, ctrl, example;
    // var offset = 100
    // var point = new Point(1000,1000)
    beforeEach(inject(function ($rootScope) {

        scope = $rootScope.$new();
        example = new Example();
        ctrl = new ExampleController(scope, example);
    }));

    it('takes an example and puts it on the scope', function() {
        expect(scope.example).toEqual(example);
    });
});
