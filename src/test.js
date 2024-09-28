import { html } from "./core.js";

 
const htmlString = `
  <div class="container" id="main">Gershom Benni P</div>
  <span style="color: red;">This is a test</span>
  <div><p>Another paragraph</p></div>
`;

let vdom = html(htmlString);