var
  fs = require('fs'),
  fse = require('fs-extra'),
  chalk = require('chalk'),
  concat = require('concat'),
  log = require('fancy-log'),
  path = require('path'),
  UglifyJS = require("uglify-es"),
  zlib = require('zlib');

function defaultMode(settings) {
  settings = {
    version: withDefault(settings.version, '4.0.0-beta'),
    locations: withDefault(settings.locations, {
      bootstrap: "./node_modules/bootstrap/js/dist/",
      popperjs: "./node_modules/popper.js/dist/",
      tether: "./node_modules/tether/dist/js/"
    }),
    destination: withDefault(settings.destination, './'),
    files: withDefault(settings.files, {
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
    }),
    minify: withDefault(settings.minify, true),
    gzip: withDefault(settings.gzip, true)
  }

  var files = getBootstrap(settings);
  var destinationPath = settings.destination + '/'
  var destinationFile =  'bootstrap'
  concat(files).then(function(code) {
    writeFile(destinationPath, destinationFile + '.js', code);
    if (settings.minify) {
      code = minifyCode(code);
      writeFile(destinationPath, destinationFile + '.min.js', code);
    }
    if (settings.gzip) {
      code = gzipCode(code);
      var fileExtension = '.min.js.gz'
      if (!settings.minify) fileExtension = '.js.gz'
      writeFile(destinationPath, destinationFile + fileExtension, code);
    }
    log('Files generated');
  });
}

function writeFile(path, filename, data) {
  fse.ensureDirSync(path);
  fs.writeFile(path + filename, data, (err) => {
    if (err) throw err;
  });
}

function minifyCode(data) {
  var result = UglifyJS.minify(data);
  if (result.error) log(chalk.red(result.error));
  return result.code
}

function gzipCode(data) {
  zlib.gzip(data, function (error, result) {
    if (error) throw error;
    return result
  })
}

function getBootstrap(settings) {
  var bootstrapPath = settings.locations.bootstrap;
  var popperPath = settings.locations.popperjs;
  var tetherPath = settings.locations.tether;
  if (bootstrapPath.substring(0,2) === './'){
    bootstrapPath = (bootstrapPath).replace("./", "");
  }
  if (popperPath.substring(0,2) === './'){
    popperPath = (popperPath).replace("./", "");
  }
  if (tetherPath.substring(0,2) === './'){
    tetherPath = (tetherPath).replace("./", "");
  }
  var bootstrap = [bootstrapPath + '/util.js'];
  for (var prop in settings.files) {
    if (settings.files[prop]) {
      var path = bootstrapPath + '/' + prop + '.js';
      if (prop === 'tooltip') {
        if ((settings.version).includes('4.0.0-beta')) {
          bootstrap.push(popperPath + '/popper.js');
        } else {
          bootstrap.push(tetherPath + '/tether.js');
        }
      }
      bootstrap.push(path);
    }
  }
  return bootstrap
}

function withDefault(data, defaultValue){
  if (!data) data = defaultValue;
  return data
}

module.exports = defaultMode;