# Bootstrap Generator [![NPM version][npm-image]][npm-url]

Generating custom Bootstrap JS files. Only use the parts you need. The generator makes sure you load the right parts.

## Install

```
$ npm install --save bootstrap-generator
```

## Usage 
Example:

```js
var bootstrap = require('bootstrap-generator');

bootstrap({
    location: "./node_modules/bootstrap/js/dist/",
    files: {
      alert: true,
      button: true,
      carousel: true,
      collapse: true,
      dropdown: true,
      modal: true,
      popover: true,
      scrollspy: true,
      tab: true,
      tooltip: true
    },
    minify: false,
    gzip: false,
    destination: './destination/'
  });
```

### Options

| Name                  | Type               | Default                              | Description   |
| --------------------- | ------------------ | ------------------------------------ | ------------- |
| location              | `string`           | `./node_modules/bootstrap/js/dist/`  | Location of Bootstrap js files |  
| destination           | `string`           | `./`                                 | Destination for Bootstrap Files |  
| files                 | `Object`           | All parts are included               | Which parts of bootstrap do you want to use |  
| minify                | `Boolean`          | `True`                               | Generate minified version of Bootstrap.js |  
| gzip                  | `Boolean`          | `True`                               | Generate gzip version of Bootstrap.js |  


## Changelog
 **v1.0.0 - 2017-12-03** 
* Initial release


[npm-url]: https://www.npmjs.com/package/bootstrap-generator
[npm-image]: https://img.shields.io/npm/v/bootstrap-generator.svg