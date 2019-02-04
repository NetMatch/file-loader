"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;
exports.raw = void 0;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _options = _interopRequireDefault(require("./options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptions() {
  const options = _loaderUtils.default.getOptions(this) || {};
  (0, _schemaUtils.default)(_options.default, options, 'File Loader');
  return options;
}

function createUrl(context, options, content) {
  return _loaderUtils.default.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp
  });
}

function createOutputPath(url, options, context) {
  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, this.resourcePath, context);
    } else {
      outputPath = _path.default.posix.join(options.outputPath, url);
    }
  }

  return outputPath;
}

function loader(content) {
  const options = getOptions.call(this);
  const context = options.context || this.rootContext;
  const url = createUrl.call(this, context, options, content);
  const outputPath = createOutputPath.call(this, url, options, context);
  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, this.resourcePath, context);
    } else {
      publicPath = `${options.publicPath.endsWith('/') ? options.publicPath : `${options.publicPath}/`}${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    this.emitFile(outputPath, content);
  } // TODO revert to ES2015 Module export, when new CSS Pipeline is in place


  return `module.exports = ${publicPath};`;
}

const raw = true;
exports.raw = raw;

function pitch() {
  const options = getOptions.call(this);
  const context = options.context || this.rootContext;
  const url = createUrl.call(this, context, options, null);
  const outputPath = createOutputPath.call(this, url, options, context);

  for (let i = this.loaderIndex; i < this.loaders.length; i++) {
    const loadr = this.loaders[i];
    const data = loadr.data || {};
    data.outputPath = outputPath;
    loadr.data = data;
  }
}