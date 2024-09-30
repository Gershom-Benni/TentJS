import { html } from "./core.js";

const simpleHtmlString = `
  <div class="container" id="main">Simple Test</div>
  <span style="color: red;">This is a test</span>
  <div><p>Another paragraph</p></div>
`;
let vdom = html(simpleHtmlString);

const nestedHtmlString = `
  <div class="outer-container">
    <div class="inner-container">
      <div class="nested-container">
        <p>Deeply nested content here</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </div>
  </div>
`;
vdom = html(nestedHtmlString);

let largeHtmlString = '<ul>';
for (let i = 0; i < 1000; i++) {
  largeHtmlString += `<li>Item ${i}</li>`;
}
largeHtmlString += '</ul>';
vdom = html(largeHtmlString);

const attributeUpdateHtml = `
  <div class="container" id="main" style="background-color: blue;">Initial state</div>
`;
vdom = html(attributeUpdateHtml);

setTimeout(() => {
  const updatedHtml = `
    <div class="container" id="main" style="background-color: green;">Updated state</div>
  `;
  vdom = html(updatedHtml, vdom);
}, 2000);

let counter = 0;
setInterval(() => {
  const dynamicHtmlString = `
    <div class="container">
      <span>Counter: ${counter}</span>
    </div>
  `;
  vdom = html(dynamicHtmlString, vdom);
  counter++;
}, 500);

const complexHtmlString = `
  <div class="complex-container" id="complex">
    <header>
      <h1>Title</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <section>
      <article>
        <p>This is an article with <strong>bold</strong> text and a <a href="#link">link</a>.</p>
      </article>
      <aside>
        <p>This is a sidebar with some additional content.</p>
      </aside>
    </section>
    <footer>
      <p>&copy; 2024 TentJS Framework Testing</p>
    </footer>
  </div>
`;
vdom = html(complexHtmlString);
