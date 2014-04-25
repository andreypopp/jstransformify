var vm              = require('vm');
var assert          = require('assert');
var browserify      = require('browserify');
var jstransformify  = require('./index');

describe('jstransformify', function() {

  it('works', function(done) {
    browserify('./fixture')
      .transform({visitors: 'jstransform/visitors/es6-class-visitors'}, jstransformify)
      .bundle(function(err, code) {
        if (err) return done(err);
        assert.ok(code);

        var value;
        var sandbox = {
          console: { log: function(v) { value = v.toString(); } }
        };

        vm.runInNewContext(code, sandbox);
        assert.equal(value, 'fixture code');

        done();
      });
  });

});
