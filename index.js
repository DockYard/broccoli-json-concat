var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var Plugin = require("broccoli-plugin");

module.exports = class JsonConcat extends Plugin {
  constructor(inputTree, options) {
    super([inputTree], {
      name: "JsonConcat",
      annotation: `JsonConcat variableName:${options.variableName} output:${
        options.outputFile
      }`,
      persistentOutput: options.persistentOutput,
      needCache: options.needCache
    });

    this.options = options;
  }

  build() {
    const obj = readDirectory(this.inputPaths[0]);
    let output;

    function readDirectory(srcDir) {
      const obj = {};
      const entries = fs.readdirSync(srcDir);

      Array.prototype.forEach.call(entries, function(entry) {
        if (fs.lstatSync(path.join(srcDir, entry)).isDirectory()) {
          obj[entry] = readDirectory(path.join(srcDir, entry));
        } else {
          obj[entry.split(".")[0]] = JSON.parse(
            fs.readFileSync(path.join(srcDir, entry))
          );
        }
      });

      return obj;
    }

    output = [this.options.variableName, JSON.stringify(obj, null, 2)];

    mkdirp.sync(
      path.join(this.outputPath, path.dirname(this.options.outputFile))
    );
    fs.writeFileSync(
      path.join(this.outputPath, this.options.outputFile),
      output.join(" = ")
    );
  }
};
