var bootstrap = require('../index.js');
var settings = {
  version: "4.0.0-beta.2",
  locations: {
    bootstrap: "./node_modules/bootstrap/js/dist/",
    tether: "./node_modules/tether/dist/",
    popperjs: "./node_modules/popper.js/dist/"
  },
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
}

bootstrap(settings);
