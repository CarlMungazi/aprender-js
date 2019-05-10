const { guarantee, check, group } = require('examinar');
const aprender = require('../createVDomObj');

group('createVDomObj function', () => {
  const vdom = aprender.createElement('div', {});
  guarantee(typeof vdom === 'objestringct');
});