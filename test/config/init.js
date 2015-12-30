require('babel-register');

global.fs = require('fs');
global.assert = require('assert');

global.pwd = () => {

	var sys = require('sys')
	var exec = require('child_process').exec;

	child = exec('pwd', function (error, stdout, stderr) {
	  sys.print('==> Current directory: ' + stdout);
	  // sys.print('stderr: ' + stderr);
	  if (error !== null) {
	    console.log('exec error: ' + error);
	  }
	});
};

global.readFile = (path) => fs.readFileSync(path, 'utf8');

global.fileName = (path) => path.match(/^.*\/(.+)$/)[1];