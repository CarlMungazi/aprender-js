const aprender = require('../src/aprender');

const vApp = aprender.createElement(
  'div', 
  {
    attrs: { id: 'app'},
    children: [
      'Hello, world',
      aprender.createElement(
        'img',
        {
          attrs: {
            src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
          }
        }
      )
    ]
  },
);

const app = aprender.render(vApp);

aprender.mount(app, document.getElementById('app'));