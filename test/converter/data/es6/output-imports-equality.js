import assert from 'assert';
import a from 'a';
import library from '.././main-script.js';
import b from 'b';

it('Example two', () => {

    if (conditionMet) {
        require('global-pollution');
    }
    const result = library.someFunction();
    assert.deepEqual(result, 'some-result');
});
