#!/usr/bin/env node

let commander = require("commander"),
    theme = require('..').init,
    dirName = '';

function versionName(name) {
    return name.split('@');
}

commander
    .option('-i, --install <name>', 'download zznode development theme package', versionName)
	.option('-f, --info', 'Download usage commands for presentation templates ...')
    .arguments('<dirName>')
    .action(function(val) {
        dirName = val;
    })
    .parse(process.argv);

theme({
    install: commander.install,
	info: commander.info
    dirName: dirName
});