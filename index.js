'use strict';

var path        = require('path');
var sourceMap   = require('convert-source-map');
var jstransform = require('jstransform');
var resolve     = require('resolve/lib/sync');
var through     = require('through');

var cache = {};

function jstransformify(filename, opts) {
  var src = '';
  var visitorList = [];

  if (/\.json$/.test(filename)) {
    return through();
  }

  [].concat(opts.v).concat(opts.visitors).filter(Boolean).forEach(function(v) {
    if (isString(v)) {
      var basedir = path.dirname(filename);
      var cached = cache[basedir + ':' + v];
      if (!cached) {
        var required = require(resolve(v, {basedir: basedir})).visitorList;
        cached = cache[basedir + ':' + v] = required;
      }
      v = cached;
    } else if (v.visitorList) {
      v = v.visitorList;
    }
    visitorList = visitorList.concat(v);
  });

  return through(
    function(c) { src += c; },
    function() {
      try {
        var r = jstransform.transform(visitorList, src, {
          sourceMap: true,
          filename: filename
        });

        var map = sourceMap.fromJSON(r.sourceMap);
        map.sourcemap.file = filename;
        map.sourcemap.sources = [filename];
        map.sourcemap.sourcesContent = [src];

        this.queue(r.code + '\n' + map.toComment());
        this.queue(null);
      } catch (err) {
        this.emit('error', 'while transforming ' + filename + ':' + err);
      }
    });
}

function isString(o) {
  return Object.prototype.toString.call(o) === '[object String]';
}

module.exports = jstransformify;
