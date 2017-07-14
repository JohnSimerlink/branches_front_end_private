'use strict';

import { Example } from '../js/Example';

describe('RadifyProspector.Example', function() {

    describe('Example', function() {
        var sut;

        beforeEach(function() {
            sut = new Example();
        });

        describe('constructor()', function() {
            it('sets reasonable defaults', function() {
                expect(sut.foo).toEqual('bar');
                expect(2).toEqual(2)
            });
        });
    });
});
