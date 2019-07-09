const fs = require('fs');
const path = require('path');
const htmlParser = require('posthtml-parser');
const { walk } = require('posthtml/lib/api');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAstSync } = require('@babel/core');

let moduleID = 0;
const rootAsset = {
  outDir: '',
  content: '',
  entryJsFilePath: '',
  rootDir: '',
  dependencyGraph: ''
}

function getRootDir(file) {
  const parsed = path.parse(file);

  return path.resolve(parsed.dir);
}

function extractEntryJSFilePathFromRootHtml(rootAsset) {
  const parsedHTML = htmlParser(rootAsset.content);
  parsedHTML.walk = walk;

  parsedHTML.walk(node => {
    if (node.tag === 'script') {
      rootAsset.entryJsFilePath = path.resolve(rootAsset.rootDir, node.attrs.src)
    }

    return node;
  });
}

function createRootAssetFromRootHtml(file) {
  // read the contents of the file
  rootAsset.content = fs.readFileSync(file, 'utf-8');
  // find root directory
  rootAsset.rootDir = getRootDir(file);
  // create path to output directory
  rootAsset.outDir = path.resolve('dist');
  // find path for entry js file
  extractEntryJSFilePathFromRootHtml(rootAsset);

  // create dependency graph
  rootAsset.dependencyGraph = createDependencyGraph(rootAsset.entryJsFilePath);

  return rootAsset;
}

// using the entry js file from the entry html file, extract all the dependencies
function createDependencyGraph(entryFile) {
  const mainAsset = createJSAsset(entryFile);

  const queueOfAssetsToParseTheirDependencies = [mainAsset]
  
  for ( asset of queueOfAssetsToParseTheirDependencies ) {
    const dirname = path.dirname(asset.filename);

    asset.relativeFilePathsOfDependenciesArray.forEach(filePath => {
      const absolutePath = path.join(dirname, `${filePath}.js`); // we only deal with JS files, so we assume it here
      const dependenciesOfFileBeingCurrentlyProcessed = createJSAsset(absolutePath);

      asset.mapping[filePath] = dependenciesOfFileBeingCurrentlyProcessed.id;

      queueOfAssetsToParseTheirDependencies.push(dependenciesOfFileBeingCurrentlyProcessed);
    });
  }
  
  return queueOfAssetsToParseTheirDependencies;
}

function createJSAsset(filename) {
  
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babylon.parse(content, { sourceType: 'module' });

  const relativeFilePathsOfDependenciesArray = [];

  traverse(ast, {
    ImportDeclaration({ node }) { // for es6 modules
      relativeFilePathsOfDependenciesArray.push(node.source.value)
    },
    CallExpression({ node })  { // for commonjs, based on parcel
      const { callee, arguments: args } = node;
      if (
        callee.name === 'require' &&
        args.length === 1 &&
        args[0].type === 'StringLiteral'

      ) {
        relativeFilePathsOfDependenciesArray.push(args[0].value)
      }
    }
  })

  const id = moduleID++;
  
  const { code } = transformFromAstSync(ast, null, {
    presets: ['@babel/env'] // had to install @babel-env in aprender.js node modules
  });

  return {
    id,
    code,
    filename,
    relativeFilePathsOfDependenciesArray,
    mapping: {}
  }
}

function createBundle(entryFile) {
  const rootAsset = createRootAssetFromRootHtml(entryFile);

  let modules = '';

  rootAsset.dependencyGraph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = {};

        fn(localRequire, module);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;
  console.log(result)


  // create the output directory
  // fs.mkdirSync(rootAsset.outDir);

  // create output html and js files
  // create server and serve files
};

module.exports = createBundle;