var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-writer');
var Promise = require('rsvp').Promise

JsonConcat.prototype = Object.create(Writer.prototype);
JsonConcat.prototype.constructor = JsonConcat;
function JsonConcat (inputTree, options) {
  if (!(this instanceof JsonConcat)) return new JsonConcat(inputTree, options);

  this.inputTree = inputTree;
  this.options = options;
};

JsonConcat.prototype.write = function (readTree, destDir) {
  var _this = this

  return readTree(this.inputTree).then(function(srcDir) {
    var obj = readDirectory(srcDir);
    var output;

    function readDirectory (srcDir) {
      var obj = {};
      var entries = fs.readdirSync(srcDir);
      Array.prototype.forEach.call(entries, function(entry) {
        if (fs.lstatSync(path.join(srcDir, entry)).isDirectory()) {
          obj[entry] = readDirectory(path.join(srcDir, entry));
        } else {
          obj[entry.split('.')[0]] = JSON.parse(fs.readFileSync(path.join(srcDir, entry)));
        }
      });

      return obj;
    };

    output = [_this.options.variableName, JSON.stringify(obj, null, 2)]


    fs.writeFileSync(path.join(destDir, _this.options.outputFile), output.join(' = '))
  });
};

module.exports = JsonConcat;
