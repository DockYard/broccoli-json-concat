# Broccoli JSON Concat

## Usage

Create a payload file based upon directory structure.

```javascript
var jsonConcat = require('broccoli-json-concat');

var tree = jsonConcat(targetDirectory);
```

### Options

The builder accepts an optional hash of options:

- `persistentOutput`: boolean flag passed to [broccoli-plugin](https://github.com/broccolijs/broccoli-plugin#reference).
- `needCache`: boolean flag passed to [broccoli-plugin](https://github.com/broccolijs/broccoli-plugin#reference).
- `variableName`: If set, the file contains a variable declaration to
  this variable name.
- `outputFile`: name of the output file.

## Documentation

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
yarn
yarn test
```

## License

This project is distributed under the MIT license.
