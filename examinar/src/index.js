'use strict';

const colors = require('colors');
const assert = require('./assertions');
const createMockDom = require('./mock-dom');

const repeat = (str, n) => Array(n).join(str);
const indent = n => repeat('    ', n);
const indentLines = (str, n) => indent(n) + str.replace(/\n/g, `\n${indent(n)}`);
const log = str => console.log(str);
const summary = { success: 0, fail: 0, disabled: 0 };

let indentLevel = 0;

// Hooks 
const beforeAll = (fn) => fn();

function group(title, fn) {
  indentLevel++;
  log(`\n${indent(indentLevel)}⇨ ${title}`.yellow);
  fn();
  indentLevel--;
}

function check(title, fn) {
  try {
    fn();
    log(`${indent(indentLevel + 1)}${' OK '.bgGreen.black} ${title.green}`);
    summary.success++;
  } catch (e) {
    log(`${indent(indentLevel + 1)}${' FAIL '.bgRed.black} ${title.red}`);
    log(indentLines(e.message.red, indentLevel + 1));
    log(indentLines(e.stack.red, indentLevel + 1));
    summary.fail++;
  }
}

function xcheck(title) {
  log(`${indent(indentLevel + 1)}${' DISABLED '.bgWhite.black} ${title.gray}`);
  summary.disabled++;
}

function end() {
  log(`\n${repeat('.', 60)}\n`);
  log('Test summary:\n');
  log(`    Success: ${summary.success}`.green);
  log(`    Fail: ${summary.fail}`.red);
  log(`    Disabled: ${summary.disabled}\n\n`.gray);

  if (summary.fail > 0 ) process.exit(1);
  process.exit(0);
}

module.exports = { assert, check, end, group, createMockDom, beforeAll, xcheck };