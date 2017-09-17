var exec = require('exec');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var run = require('gulp-run')

gulp.task('test', function () {
    test()
});

gulp.task('test-watch', function () {
    test()
    watch('**/*.js', batch(function (events, done) {
        gulp.start('test', done);
    }));
});
function test(){
    console.log('rerunning tests! . . .');
    run("mocha --compilers js:babel-register --require babel-polyfill").exec() //, function(err, out, code){
}
