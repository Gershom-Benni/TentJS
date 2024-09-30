# TentJS Framework Documentation

TentJS is a lightweight JavaScript framework designed for efficient DOM manipulation using a Virtual DOM (vDOM) system. It allows you to render dynamic HTML content and apply updates with minimal performance impact by selectively re-rendering only the elements that have changed.

## Key Features:
- **Virtual DOM (vDOM)**: Provides an optimized way to manage DOM updates by diffing the old and new virtual nodes and only updating what has changed.
- **Declarative HTML Rendering**: Write HTML in a clean, string-based format, and TentJS handles the conversion to virtual nodes.
- **Automatic DOM Diffing**: When re-rendering, TentJS automatically compares the new HTML structure to the current vDOM, ensuring only modified elements are updated, which leads to efficient rendering.
- **Component-Based**: Supports breaking down the UI into manageable components for better reusability and organization.

## Usage:
You start by defining your HTML in a string, then TentJS handles parsing, rendering, and updating it in the DOM. Reactivity and advanced features like component lifecycle methods will be introduced soon.

This framework is ideal for developers who need lightweight, performance-focused DOM manipulation without the complexity of larger frameworks.

## Coming Soon:
- **Reactivity**: Dynamic updates to your UI in response to changes in state or data.
