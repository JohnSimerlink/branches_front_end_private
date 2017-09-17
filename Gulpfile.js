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
    run("npm run test").exec() //, function(err, out, code){
    //     if (err){
    //         console.log("THERE WAS AN ERROR")
    //         console.error('error of ', err)
    //     }
    // })
}
