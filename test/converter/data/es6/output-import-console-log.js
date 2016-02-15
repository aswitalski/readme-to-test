var assert = require('assert');
import library from '.././main-script.js';

it('Example one', () => {

    if (conditionMet) {
        require('global-pollution');
    }
    const result = library.someFunction();

    // console.log(result);
    assert.deepEqual(result, 'some-result');
});
