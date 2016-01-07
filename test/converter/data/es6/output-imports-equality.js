import assert from 'assert';
import a from 'a';
import library from './main-script';
import b from 'b';

describe('Example one', () => {
    if (conditionMet) {
        require('global-pollution');
    }
    const result = library.someFunction();
    assert.deepEqual(result, 'some-result');
});
