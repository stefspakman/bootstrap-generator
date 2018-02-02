var bootstrap = require('../index.js');
var settings = {
  location:  "./node_modules/bootstrap/js/dist/",
  files: {
    alert: false,
    button: false,
    carousel: false,
    collapse: false,
    dropdown: true,
    modal: false,
    popover: false,
    scrollspy: false,
    tab: false,
    tooltip: false
  },
  minify: false,
  gzip: false,
  destination: './destination/',
  wrap: {
    header: "test(function ($, Drupal) {",
    footer: "})(jQuery, Drupal);"
  }
}

bootstrap(settings);
