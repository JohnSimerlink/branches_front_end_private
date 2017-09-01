// Example Gulp file that shows you how to run ES6 tests with Karma and Require

var gulp = require('gulp');
var babel = require('gulp-babel');
var Server = require('karma').Server;

var paths = {
    src:      ['app/**.js', 'app/*/**.js'],
    dest:     'build/js',
    specSrc:  'spec/*Spec.js',
    specDest: 'build/spec',
    spec:     'build/spec/*Spec.js'
};

function build(src, dst) {
    var pipe = gulp.src(src).pipe(babel({ modules: "amd" })), dest = gulp.dest(dst);
    return pipe.pipe(dest);
}

gulp.task('build-src', function() {
    return build(paths.src, paths.dest);
});

gulp.task('build-test', function() {
    return build(paths.specSrc, paths.specDest);
});

// Run the unit test without any coverage calculations
gulp.task('test', ['build-src', 'build-test'], function(cb) {
    new Server({
        configFile: __dirname + '/spec/karma.conf.js'
        ,singleRun: true
    }, cb).start();
});

gulp.task('build', ['build-src', 'build-test']);

gulp.task('default', ['build', 'test']);

gulp.on('err', function(e) {
    console.error(e.err.stack);
});
