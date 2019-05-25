'use strict';

const colors = require('colors');
const matchers = require('./matchers');
const createMockDom = require('./mock-dom');

const examinar = {};
const repeat = (str, n) => Array(n).join(str);
const indent = n => repeat('    ', n);
const indentLines = (str, n) => indent(n) + str.replace(/\n/g, `\n${indent(n)}`);
const log = str => console.log(str);
const summary = { success: 0, fail: 0, disabled: 0 };

let indentLevel = 0;

// Hooks 
function beforeAll (fn) {
  return fn();
}

const group = (title, cb) => {
  indentLevel++;
  console.log(`\n${indent(indentLevel)}⇨ ${title}`.yellow);
  cb();
  indentLevel--;
}

const check = (title, cb) => {
  try {
    cb();
    console.log(`${indent(indentLevel + 1)}${' OK '.bgGreen.black} ${title.green}`);
    summary.success++;
  } catch (e) {
    console.log(`${indent(indentLevel + 1)}${' FAIL '.bgRed.black} ${title.red}`);
    console.log(indentLines(e.message.red, indentLevel + 1));
    console.log(indentLines(e.stack.red, indentLevel + 1));
    summary.fail++;
  }
};

function xcheck(title) {
  console.log(`${indent(indentLevel + 1)}${' DISABLED '.bgWhite.black} ${title.gray}`);
  summary.disabled++;
}

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

const api = { guarantee, check, end, group, createMockDom, beforeAll, xcheck };

module.exports = Object.assign(examinar, api);