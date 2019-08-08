const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const htmlParser = require('posthtml-parser');
const htmlRender = require('posthtml-render');
const { walk } = require('posthtml/lib/api');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAstSync } = require('@babel/core');
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

let moduleID = 0;
const rootAsset = {
  outDir: '',
  content: '',
  entryJsFilePath: '',
  rootDir: '',
  dependencyGraph: '',
  ast: ''
}

function getRootDir(file) {
  const parsed = path.parse(file);

  return path.resolve(parsed.dir);
}

function extractEntryJSFilePathFromEntryFile(rootAsset) {
  const parsedHTML = htmlParser(rootAsset.content);
  
  rootAsset.ast = parsedHTML;
  parsedHTML.walk = walk;
 
  parsedHTML.walk(node => {
    if (node.tag === 'script') {
      if (node.attrs.src.endsWith('/index.js')) {
        rootAsset.entryJsFilePath = path.resolve(rootAsset.rootDir, node.attrs.src)
      }
    }

    return node;
  });

  if (!rootAsset.entryJsFilePath) throw Error('No JavaScript entry file has been provided or specified. Either specify an entry file or make sure the entry file is named \'index.js\'');
}

function createRootAssetFromEntryFile(file, config) {
  // read the contents of the file
  rootAsset.content = fs.readFileSync(file, 'utf-8');
  // find root directory
  rootAsset.rootDir = getRootDir(file);
  // create path to output directory
  rootAsset.outDir = path.resolve('dist');
  // find path for entry js file
  if (config.entryJsFile) {
    rootAsset.ast = htmlParser(rootAsset.content);
    rootAsset.entryJsFilePath = path.resolve(rootAsset.rootDir, config.entryJsFile);
  } else {
    extractEntryJSFilePathFromEntryFile(rootAsset);
  }

  // create dependency graph
  rootAsset.dependencyGraph = createDependencyGraph(rootAsset.entryJsFilePath);

  return rootAsset;
}

// using the entry js file from the entry html file, extract all the dependencies
function createDependencyGraph(entryFile) {

  const mainAsset = createJSAsset(entryFile);

  const assetsThatNeedDependenciesExtracted = [ mainAsset ];
  
  for ( asset of assetsThatNeedDependenciesExtracted ) {
    const dirname = path.dirname(asset.filename);
    
    asset.relativeFilePathsOfDependenciesArray.forEach(filePath => {
      // we only deal with JS files, so we assume it here
      // plus we get this from the traverse module
      const absolutePath = path.join(dirname, `${filePath}.js`); 
      const dependenciesOfFileBeingCurrentlyProcessed = createJSAsset(absolutePath);

      asset.mapping[filePath] = dependenciesOfFileBeingCurrentlyProcessed.id;

      assetsThatNeedDependenciesExtracted.push(dependenciesOfFileBeingCurrentlyProcessed);
    });
  }
  
  return assetsThatNeedDependenciesExtracted;
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
    presets: ['@babel/env'],
    cwd: __dirname
  });

  return {
    id,
    code,
    filename,
    relativeFilePathsOfDependenciesArray,
    mapping: {}
  }
}

function createBundle(entryFile, config) {
  let modules = '';
  let bundle;
  const rootAsset = createRootAssetFromEntryFile(entryFile, config);

  const bundlePath = path.resolve(rootAsset.outDir, 'index.js');
  const bundleHtml = htmlRender(rootAsset.ast);
  const bundleHtmlPath = path.resolve(rootAsset.outDir, 'index.html');
  

  rootAsset.dependencyGraph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  bundle = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports: {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;


  // create the output directory if it does not exist
  if (!fs.existsSync(rootAsset.outDir)) {
    fs.mkdirSync(rootAsset.outDir);
  }
  

  // create output html and js files
  fs.writeFileSync(bundlePath, bundle);
  fs.writeFileSync(bundleHtmlPath, bundleHtml);

  // create server and serve files
  const serve = serveStatic(rootAsset.outDir); 
  const server = http.createServer( function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(3000);
  console.log(`${chalk.bold('Now serving the application on')} ${chalk.red('http://localhost:3000')}`);

};

module.exports = createBundle;