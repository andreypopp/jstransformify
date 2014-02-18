var assert          = require('assert');
var browserify      = require('browserify');
var jstransformify  = require('./index');

describe('jstransformify', function() {

  it('works', function(done) {

    browserify('./fixture')
      .transform({visitors: 'jstransform/visitors/es6-class-visitors'}, jstransformify)
      .bundle(function(err, result) {
        if (err) return done(err);
        assert.ok(result);
        done();
      });
  });
});
