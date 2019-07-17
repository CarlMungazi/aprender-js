function renderElement({ type, attrs, children }) {
  const $el = document.createElement(type);

  for (const [attribute, value] of Object.entries(attrs)) {
    $el.setAttribute(attribute, value);
  }
  for (const child of children) {
    $el.appendChild(render(child));
  }

  return $el;
};

function render(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  return renderElement(vNode);
};

module.exports = render;