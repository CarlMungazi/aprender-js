"use strict";

const document = {
  createElement(tag) {
    const element = {
      nodeType: 1,
      nodeName: tag.toUpperCase(),
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      parentNode: null,
      childNodes: [],
      appendChild,
      setAttribute,
      attributes: {},
      $$dom: null
    }

    return element;
  },
  createTextNode(text) {
    const nodeVal = text;

    return {
      nodeType: 3,
      nodeName: "#text",
      parentNode: null,
      get nodeVal() {
        return nodeVal;
      },
      set nodeVal(val) {
        nodeVal = val
      }
    }
  },
  getElementById(id) {
    // implement a hash map look up: https://stackoverflow.com/questions/2711303/javascript-getelementbyid-lookups-hash-map-or-recursive-tree-traversal
  }
}

function appendChild(child) {
  let ancestor = this;

  while (ancestor !== child && ancestor !== null) ancestor = ancestor.parentNode
  if (ancestor === child) throw new Error("Ancestor cannot be equal to child")
  if (child.nodeType == null) throw new Error("The child is not a DOM element")

  const index = this.childNodes.indexOf(child);
  if (index > -1 ) this.childNodes.splice(index, 1)

  this.childNodes.push(child);
  if (child.parentNode != null && child.parentNode !== this) child.parentNode.removeChild(child)
  child.parentNode = this;
}

function setAttribute(name, value) {
  this.attributes[name] = value;
}

function createMockDom() {
  document.documentElement = document.createElement("html");
  document.documentElement.appendChild(document.createElement("head"));
  document.body = document.createElement("body");
  document.documentElement.appendChild(document.body);
  const $root = document.createElement("div");
  $root.setAttribute('id', 'root');
  document.body.appendChild($root);

  global.document = document;
}

module.exports = createMockDom;