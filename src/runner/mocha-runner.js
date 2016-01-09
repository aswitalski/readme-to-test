import Mocha from 'mocha';

export default (files) => {

    require('babel-register');

    const mocha = new Mocha();
    files.map(file => mocha.addFile(file));

    mocha.run(failures => {
        process.on('exit', () => process.exit(failures));
    });
};
