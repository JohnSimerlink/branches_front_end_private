define(['exports', '../js/Example'], function (exports, _jsExample) {
    'use strict';

    describe('RadifyProspector.Example', function () {

        describe('Example', function () {
            var sut;

            beforeEach(function () {
                sut = new _jsExample.Example();
            });

            describe('constructor()', function () {
                it('sets reasonable defaults', function () {
                    expect(sut.foo).toEqual('bar');
                    expect(2).toEqual(2);
                });
            });
        });
    });
});