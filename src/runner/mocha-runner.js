import Mocha from 'mocha';
import Promise from 'bluebird';

export default (files) => {

    require('babel-register');

    const mocha = new Mocha();
    files.map(file => mocha.addFile(file));

    return new Promise((resolve, reject) => {
      mocha.run(resolve)
    })
};
