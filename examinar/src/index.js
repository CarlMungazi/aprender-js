'use strict';

const colors = require('colors');
const matchers = require('./matchers');
const examinar = {
  SILENT: false
};

const repeat = (str, n) => Array(n).join(str);
const indent = n => repeat('    ', n);
const indentLines = (str, n) => indent(n) + str.replace(/\n/g, `\n${indent(n)}`);

const runEveryBeforeEach = () => {
  beforeEachStack.forEach((level) => level.forEach(cb => cb()));
}

const log = str => !examinar.SILENT && console.log(str);

const summary = { success: 0, fail: 0, disabled: 0 };

const beforeEachStack = [ [] ];
let indentLevel = 0;

const group = (title, cb) => {
  indentLevel++;
  console.log(`\n${indent(indentLevel)}⇨ ${title}`.yellow);
  cb();
  indentLevel--;
}

const xcheck = (title, cb) => {
  console.log(`${indent(indentLevel + 1)}${' DISABLED '.bgWhite.black} ${title.gray}`);
  summary.disabled++;
};

const check = (title, cb) => {
  runEveryBeforeEach();

  try {
    cb();
    console.log(`${indent(indentLevel + 1)}${' OK '.bgGreen.black} ${title.green}`);
    summary.success++;
  } catch (e) {
    console.log(`${indent(indentLevel + 1)}${' FAIL '.bgRed.black} ${title.red}`);
    console.log(indentLines(e.stack.red, indentLevel + 1));
    summary.fail++;
  }
};

const guarantee = val => {
  if (val) return true;

  throw new Error('Assertion failed');
};

Object.assign(guarantee, matchers);

const end = () => {
  log(`\n${repeat('.', 60)}\n`);
  log('Test summary:\n');
  log(`    Success: ${summary.success}`.green);
  log(`    Fail: ${summary.fail}`.red);
  log(`    Disabled: ${summary.disabled}\n\n`.gray);

  if (summary.fail > 0 ) process.exit(1);
  process.exit(0);
}

const beforeAll = cb => cb();
const beforeEach = cb => {
  beforeEachStack[beforeEachStack.length - 1].push(cb);
}

const dsl = { guarantee, check, xcheck, end, group, beforeEach, beforeAll };

module.exports = Object.assign(examinar, dsl);