#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const version = require('../package.json').version;
const bundler = require('../src/bundler');

program.version(version);

program
  .command('serve <filename>')
  .description('serves the files')
  .option(
    '--entry <file>',
    'set the name of the entry HTML file'
  )
  .action(bundle);

// Make serve the default command 
if (process.argv[2] !== 'serve') process.argv.splice(2, 0, 'serve');

program.parse(process.argv);

function bundle (entryFile, command) {
  bundler(entryFile, {
    entryFile: command.entry
  });
}