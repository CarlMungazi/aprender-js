# Learn JavaScript By Building A UI Framework

## What Is This?

A project similar to [this](https://github.com/taniarascia/laconia). They say one of the best ways is to learn is by doing. Well, this is just that. There are so many tools used in frontend development and this is my attempt at learning some of them from a first principles approach. I am building basic, non-production versions of various parts of the frontend stack and documenting the lessons learned in the process.

The articles written in the series so far are:

- [Introduction to the UI framework](https://dev.to/carlmungazi/learning-javascript-by-building-a-ui-framework-from-scratch-1767)
- [Building a testing library](https://dev.to/carlmungazi/learn-js-by-building-a-ui-framework-part-2-testing-3pff)
- [Rendering and testing DOM elements](https://dev.to/carlmungazi/learn-javascript-by-building-a-ui-framework-part-3-rendering-testing-dom-elements-97l)
- [Building a module bundler](https://dev.to/carlmungazi/learn-javascript-by-building-a-ui-framework-part-4-creating-a-module-bundler-11el)

Whilst not part of the series, [this](https://www.smashingmagazine.com/2019/07/javascript-knowledge-reading-source-code/#comments-javascript-knowledge-reading-source-code) article I wrote for Smashing Magazine explains some of the benefits of this project.

## Aprender

Aprender is the UI framework and it is built using the virtual DOM paradigm. It contains the following features:
- Turning JavaScript objects into DOM elements

## Examinar

Examinar is a testing framework not modelled upon anything in particular. It has the following features:
- Assertions
- A DOM implementation for the node environment

## Maleta

Maleta is a module bundler which builds upon the work of [Minipack](https://github.com/ronami/minipack). It has the following features:
- Bundles both ES and CommonJS modules
- CLI tool
- Built-in dev server