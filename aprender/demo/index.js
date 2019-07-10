const aprender = require('../src/aprender');

const button = aprender.createElement('button', { children: ['Click Me!'] });
const component = aprender.createElement(
  'div', 
  {
    attrs: { id: 'app'},
    children: [
      'Hello, world!',
      button
    ]
  },
);

const app = aprender.render(component);

aprender.mount(app, document.getElementById('app'));