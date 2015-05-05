'use strict';

var path        = require('path');
var sourceMap   = require('convert-source-map');
var jstransform = require('jstransform/simple');
var through     = require('through');

var cache = {};

function jstransformify(filename, opts) {
  var src = '';
  var visitorList = [];

  if (/\.json$/.test(filename)) {
    return through();
  }

  return through(
    function(c) { src += c; },
    function() {
      try {
        var r = jstransform.transform(src, getTransformOptions(opts, filename));
        this.queue(r.code);
        this.queue(null);
      } catch (err) {
        this.emit('error', 'while transforming ' + filename + ':' + err);
      }
    });
}

function getTransformOptions(options, filename) {
  var out = {
    sourceMap: true,
    sourceFilename: filename
  };
  for (var k in options) {
    out[k] = options[k];
  }
  return out;
}

function isString(o) {
  return Object.prototype.toString.call(o) === '[object String]';
}

module.exports = jstransformify;
