var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Plugin = require('broccoli-plugin');

JsonConcat.prototype = Object.create(Plugin.prototype);
JsonConcat.prototype.constructor = JsonConcat;
function JsonConcat (inputTree, options) {
  if (!(this instanceof JsonConcat)) return new JsonConcat(inputTree, options);

  Plugin.call(this, [inputTree], {
    name: 'JsonConcat',
    annotation: `JsonConcat variableName:${options.variableName} output:${options.outputFile}`,
    persistentOutput: options.persistentOutput,
    needCache: options.needCache
  });
  this.options = options;
};

JsonConcat.prototype.build = function () {
  var obj = readDirectory(this.inputPaths[0]);
  var output;

  function readDirectory(srcDir) {
    var obj = {};
    var entries = fs.readdirSync(srcDir);
    Array.prototype.forEach.call(entries, function (entry) {
      if (fs.lstatSync(path.join(srcDir, entry)).isDirectory()) {
        obj[entry] = readDirectory(path.join(srcDir, entry));
      } else {
        obj[entry.split('.')[0]] = JSON.parse(fs.readFileSync(path.join(srcDir, entry)));
      }
    });

    return obj;
  };

  output = [this.options.variableName, JSON.stringify(obj, null, 2)];

  mkdirp.sync(path.join(this.outputPath, path.dirname(this.options.outputFile)));
  fs.writeFileSync(path.join(this.outputPath, this.options.outputFile), output.join(' = '));
};

module.exports = JsonConcat;
