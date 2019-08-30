#!/usr/bin/env node

const program = require('commander');
const version = require('../package.json').version;
const bundler = require('../src/bundler');

program.version(version);

program
  .command('serve <filename>')
  .description('serves the files')
  .option(
    '--entry <file>',
    'set the name of the entry JS file'
  )
  .action(bundle);

program
  .command('help [command]')
  .description('display help information for a command')
  .action(function(command) {
    let cmd = program.commands.find(c => c.name() === command) || program;
    cmd.help();
  });

const args = process.argv;

// Make serve the default command except for --help
if (args[2] === '--help' || args[2] === '-h') args[2] = 'help';
if (!args[2] || !program.commands.some(c => c.name() === args[2])) args.splice(2, 0, 'serve');

program.parse(process.argv);

function bundle (entryFile, command) {
  bundler(entryFile, {
    entryJsFile: command.entry
  });
}