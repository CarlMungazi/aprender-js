"use strict";

const document = {
  _elementIds: {},
  createElement(tag) {
    const element = {
      nodeType: 1,
      nodeName: tag.toUpperCase(),
      parentNode: null,
      childNodes: [],
      appendChild,
      setAttribute,
      attributes: {},
      $$dom: true
    };

    return element;
  },
  createTextNode(text) {
    return {
      nodeType: 3,
      nodeName: "#text",
      parentNode: null,
      data: text
    }
  },
  getElementById(id) {
    if (document._elementIds[id]) {
      return document._elementIds[id]
    }

    return null;
  }
}

function appendChild(child) {
  let ancestor = this;

  if (ancestor === child) throw new Error("Child element cannot be equal to parent element");
  if (child.nodeType == null) throw new Error("The child is not a DOM element");

  const index = this.childNodes.indexOf(child);
  if (index > -1 ) this.childNodes.splice(index, 1);

  this.childNodes.push(child);
  child.parentNode = ancestor;
}

function setAttribute(name, value) {
  this.attributes[name] = value;
  
  if (name === 'id') {
    if (document._elementIds[value]) {
      throw new Error(`${value} is already the id of an existing element`);
    }
    document._elementIds[value] = this;
  }
}

function createMockDom() {
  document.documentElement = document.createElement("html");
  document.documentElement.appendChild(document.createElement("head"));
  document.body = document.createElement("body");
  document.documentElement.appendChild(document.body);

  global.document = document;
}

module.exports = createMockDom;