# Testing

This folder is for tests. Any test in this folder will be run by `npm run test`
Tests can be nested no more than 3 folders deep in `appTest`.

## Sample Test

``` ts
import {expect} from 'chai';
import test from 'ava';

test('testName', (t) => {
    t.pass();
});
```