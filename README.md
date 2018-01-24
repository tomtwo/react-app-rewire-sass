# @tomtwo/react-app-rewire-sass

An updated version of [react-app-rewire-sass](https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-sass) which supports `react-scripts@1.1.0`, allowing you to import `.scss` files straight into Create React App projects without ejecting.

## Install

`npm install @tomtwo/react-app-rewire-sass`

or

`yarn add @tomtwo/react-app-rewire-sass`

## Usage

In your `config-overrides.js`:

```js
const rewireSass = require('@tomtwo/react-app-rewire-sass');

module.exports = function override(config, env) {
  config = rewireSass(config, env);

  return config;
};
```
