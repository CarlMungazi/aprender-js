// const create = require('./create');
// const diff = require('./diff');

var svd = require('simple-virtual-dom');
var el = svd.el
var diff = svd.diff
var patch = svd.patch

var tree = el('div', {'id': 'container'}, [
  el('h1', {style: 'color: blue'}, ['simple virtal dom']),
  el('p', ['Hello, virtual-dom']),
  el('ul', [el('li')])
]);

// var root = tree.render();

var newTree = el('div', {'id': 'container'}, [
  el('h1', {style: 'color: red'}, ['nada']),
  el('p', ['Hola']),
  el('ul', [el('li'), el('li')])
])

var patches = diff(tree, newTree)


console.log(patches)

// const oldApp = create('div', {
//   attrs: {
//     class: 'app'
//   },
//   children: [
//     create('button'),
//     create('span')
//   ]
// });

// const newApp = create('div', {
//   attrs: {
//     class: 'root'
//   },
//   children: [
//     create('button'),
//     create('p')
//   ]
// });

// diff(oldApp, newApp)

