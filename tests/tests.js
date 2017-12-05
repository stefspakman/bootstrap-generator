var bootstrap = require('../index.js');
var settings = {
  location:  "./node_modules/bootstrap/js/dist/",
  files: {
    alert: true,
    button: false,
    carousel: false,
    collapse: false,
    dropdown: true,
    modal: false,
    popover: true,
    scrollspy: false,
    tab: false,
    tooltip: true
  },
  minify: false,
  gzip: false,
  destination: './destination/'
}

bootstrap(settings);
