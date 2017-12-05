var
  fs = require('fs-extra'),
  chalk = require('chalk'),
  _ = require('lodash'),
  concat = require('concat'),
  log = require('fancy-log'),
  path = require('path'),
  UglifyJS = require("uglify-es"),
  zlib = require('zlib'),
  fetchUrl = require("fetch").fetchUrl,
  tmp = require('tmp');

function defaultMode(settings) {
  settings = {
    location: withDefault(settings.location, "./node_modules/bootstrap/js/dist/"),
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
  settings['bootstrappath'] = settings.location;
  if (settings['bootstrappath'].substring(0,2) === './'){
    settings['bootstrappath'] = (settings['bootstrappath']).replace("./", "");
  }

  var files = getBootstrap(settings);

  if (settings.files.tooltip || settings.files.dropdown) {
    var file = fs.readFileSync(settings['bootstrappath'] + '/tooltip.js','utf8');
    if (file.includes('popper')) {
      var popper = getPopper(settings['bootstrappath']);
      var getNewFiles = insertTempFile(files, createTempFile(popper));
      getNewFiles.then(function(files){
        processFiles(settings, files);
      });
    } else if (file.includes('tether')) {
      var tether = getTether(settings['bootstrappath']);
      var getNewFiles = insertTempFile(files, createTempFile(tether));
      getNewFiles.then(function(files){
        processFiles(settings, files);
      });
    } else {
      processFiles(settings, files)
    }
  } else {
    processFiles(settings, files)
  }
}

function insertTempFile(fileArray, tempFile) {
  var index = _.findIndex(fileArray, function(o) { return o.includes('tooltip.js') || o.includes('dropdown.js'); });
  return new Promise(function(resolve, reject) {
    tempFile.then(function (result) {
      fileArray.splice(index, 0, result);
      resolve(fileArray);
    })
  });
}

function createTempFile(promise) {
  return new Promise(function(resolve, reject) {
    promise.then(function(result) {
      var tempFile = tmp.fileSync();
      fs.appendFile(tempFile.name, result, (err) => {
        if (err) reject(Error(err));
        resolve(tempFile.name);
      });
    }, function(err) {
      log(chalk.red(err)); // Error: "It broke"
    });
  });
}

function processFiles(settings, files) {
  var destinationPath = settings.destination + '/'
  var destinationFile =  'bootstrap';
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
  fs.ensureDirSync(path);
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
  var bootstrap = [settings['bootstrappath'] + '/util.js'];
  for (var prop in settings.files) {
    if (settings.files[prop]) {
      var path = settings['bootstrappath'] + '/' + prop + '.js';
      bootstrap.push(path);
    }
  }
  return _.uniq(bootstrap)
}

function withDefault(data, defaultValue){
  if (!data) data = defaultValue;
  return data
}

function getPopper(path) {
  var version = getDependencyVersion(path, 'popper.js', '1.12.4');
  var url = "https://cdn.jsdelivr.net/npm/popper.js@" + version + "/dist/popper.js";
  return fetchFile(url)
}

function getTether(path) {
  var version = getDependencyVersion(path, 'tether', '1.4.3');
  var url = "https://cdnjs.cloudflare.com/ajax/libs/tether/" + version + "/js/tether.js";
  return fetchFile(url)
}

function getDependencyVersion(path, dependency, defaultVersion) {
  var nodePath = path;
  if (path.includes('node_modules')) {
    nodePath = path.substring(0, (path.indexOf('node_modules/bootstrap/') + 23));
  }
  var version;
  try {
    package = JSON.parse(fs.readFileSync(nodePath + '/package.json'));
    if (package.devDependencies[dependency]){
      version = (package.devDependencies[dependency]).replace('^', '');
    } else if (package.dependencies[dependency]){
      version = (package.dependencies[dependency]).replace('^', '');
    }
  } catch (err) {
    version = defaultVersion;
    log(err)
  }
  return version
}

function fetchFile(url) {
  return new Promise(function(resolve, reject) {
    fetchUrl(url, function(error, meta, body){
      if (error) {
        reject(Error("It broke"));
      } else {
        resolve(body.toString());
      }
    });
  });
}

module.exports = defaultMode;