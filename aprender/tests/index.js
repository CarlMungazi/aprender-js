const { assert, group, xcheck, check, end, createMockDom, beforeAll } = require('examinar'); 
const createElement = require('../src/createElement');
const render = require('../src/render');
const mount = require('../src/mount');

group('aprender', () => {
  let element;

  beforeAll(() => {
    element = createElement('div', {
      children: [
        createElement('h1', { children: ['Hello, World'] }),
        createElement('button', { children: ['Click Me!'] }),
      ]
    });

    createMockDom();
  })

  check('it creates a virtual dom object', () => {
    const target = createElement('div', { children: [{ type: 'div'}] });
    const copy = { type: 'div', attrs: {}, children: [{ type: 'div'}] };
    assert.isDeeplyEqual(target, copy);
  }); 

  check('it throws errors when a string is not specified as the first argument', () => {
    const err = () => createElement(1, null);
    assert.throws(err, 'The element type must be a string');
  });

  check('it throws errors when the options argument is not an object', () => {
    const err = () => createElement('h1', null);
    assert.throws(err, 'The options argument must be an object');
  });

  xcheck('it creates DOM elements', () => {
    assert.isDomElement( render(element) );
  });

  xcheck('it mounts DOM elements', () => {
    const app = render(element);
    mount(app, document.getElementById('root'));

    assert.isMounted(element);
  });
});

end();