# bunchee
> zero config bundler for js library

## Installation

```sh
npm install --save-dev bunchee
```

## Usage

Declare your main field and module field in package.json, then call bunchee cli in build scripts

```json
{
  "main": "dist/pkg.cjs.js",
  "module": "dist/pkg.esm.js",
  "scripts": {
    "build": "bunchee ./src/index.js"
  }
}
```

Or use it globally

```sh
# assume your file entry is ./src/index.js
# make sure there is a package.json file in your project root directory
# make sure there are `main` and `name` fields in package.json for description

cd <project-root-dir>
bunchee ./src/index.js
```
