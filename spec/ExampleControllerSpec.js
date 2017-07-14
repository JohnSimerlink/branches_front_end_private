'use strict';

import * as angular from "angular";
import * as mock from "angularMocks";
import { Example } from '../js/Example';
import { ExampleController } from '../js/ExampleController';

describe('ExampleController', function() {
    var scope, ctrl, example;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        example = new Example();
        ctrl = new ExampleController(scope, example);
    }));

    it('takes an example and puts it on the scope', function() {
        expect(scope.example).toEqual(example);
    });
});
