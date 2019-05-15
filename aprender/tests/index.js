const { guarantee, check, group } = require('examinar');
const aprender = require('../src/createElement');

group('createElement function', () => {
  const vdom = aprender.createElement('div', {});
  guarantee(typeof vdom === 'object');
});