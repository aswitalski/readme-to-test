import assert from 'assert';

it('Example three', () => {

    let keyPrefix = require('../index.js').prefix('MODE-');

    const Consts = keyPrefix({
        MOBILE: null,
        TABLET: null,
        DESKTOP: null
    });

    // console.log(Consts);
    assert.deepEqual(Consts, { MOBILE: 'MODE-MOBILE', TABLET: 'MODE-TABLET', DESKTOP: 'MODE-DESKTOP' });
});
