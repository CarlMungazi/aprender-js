const { assert, group, check, end, createMockDom, beforeAll } = require('examinar'); 
const h = require('../src/createVirtualElement');
const render = require('../src/render');
const mount = require('../src/mount');

group('aprender', () => {
  let $root;
  let element;
  let app;
  
  beforeAll(() => {
    element = h('div', {
      children: [
        h('h1', { children: ['Hello, World'] }),
        h('button', { children: ['Click Me!'] }),
      ]
    });

    createMockDom();
    
    $root = document.createElement("div");
    $root.setAttribute('id', 'root');
    document.body.appendChild($root);

    app = render(element);

  });

  check('it creates a virtual dom object', () => {
    const target = h('div', { children: [{ type: 'div'}] });
    const copy = { type: 'div', attrs: {}, children: [{ type: 'div'}] };
    assert.isDeeplyEqual(target, copy);
  }); 

  check('it throws errors when a string is not specified as the first argument', () => {
    const err = () => h(1, null);
    assert.throws(err, 'The element type must be a string');
  });

  check('it throws errors when the options argument is not an object', () => {
    const err = () => h('h1', null);
    assert.throws(err, 'The options argument must be an object');
  });

  check('it creates DOM elements', () => {
    assert.isDomElement(app);
  });

  check('it mounts DOM elements', () => {
    mount(app, document.getElementById('root'));
    
    assert.isMounted(app, $root);
  });
});

end();