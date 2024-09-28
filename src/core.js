function splitHTMLLines(htmlString) {
  const lines = htmlString.split('\n').map(line => line.trim()).filter(line => line);
  const parsedLines = lines.map(line => parseHTML(line));
  return parsedLines.filter(result => result !== null);
}

function html(htmlString) {
  const parsedLines = splitHTMLLines(htmlString);
  const nodes = createNode(parsedLines);
  const vdom = new vDom();
  nodes.forEach(node => vdom.addNode(node));
  vdom.render();
}

function createNode(parsedLines) {
  return parsedLines.map(({ tagName, child, attributes }) =>
    new vNode(tagName, attributes, child)
  );
}

function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const element = doc.body.firstElementChild;

  if (!element) {
    return null;
  }

  const tagName = element.tagName.toLowerCase();
  const child = element.textContent.trim();
  const attributes = {};
  for (const attr of element.attributes) {
    attributes[attr.name] = attr.value;
  }

  return { tagName, child, attributes };
}

// Virtual DOM Node Class
class vNode {
  constructor(tagName, attributes = {}, textContent = null) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.textContent = textContent;
  }
}

// Virtual DOM Class
class vDom {
  constructor() {
    this.dom = [];
  }

  addNode(node) {
    this.dom.push(node);
  }

  deleteNode(node) {
    const index = this.dom.indexOf(node);
    if (index > -1) {
      this.dom.splice(index, 1);
    }
  }

  updateNode(oldNode, newNode) {
    const index = this.dom.indexOf(oldNode);
    if (index > -1) {
      this.dom[index] = newNode;
    }
  }

  render() {
    const fragment = document.createDocumentFragment();
    this.dom.forEach(node => {
      const element = document.createElement(node.tagName);
      Object.entries(node.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (node.textContent) {
        element.textContent = node.textContent;
      }
      fragment.appendChild(element);
    });
    document.body.appendChild(fragment);
  }
}
html(htmlString);
