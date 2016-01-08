import Mocha from 'mocha';

export default (files) => {

    const mocha = new Mocha();
    files.map(file => mocha.addFile(file));

    mocha.run(failures => {
        process.on('exit', () => process.exit(failures));
    });
};
