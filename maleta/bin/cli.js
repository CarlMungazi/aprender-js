#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const version = require('../package.json').version;
const bundler = require('../src/bundler');

program.version(version);

program
  .command('serve <filename>')
  .description('serves the files')
  .action(bundle);

program.parse(process.argv);


function bundle (entryFile) {
  bundler(entryFile);
}