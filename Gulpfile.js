var exec = require('exec');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var run = require('gulp-run')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var pump = require('pump')
var gzip = require('gulp-gzip')

gulp.task('test', function () {
    test()
});
//for the files that error out when used in ./vendor.js
gulp.task("build-funny-modules", function(){
    const jsDest = 'dist/funny/'
    const paths = ["./other_imports/taggle/jquery-1.10.1.js",/*  "./other_imports/taggle/taggle.js"*/]
    return pump([
        gulp.src(paths),
        concat('funny.js'),
        gulp.dest(jsDest),
        rename('funny.min.js'),
        uglify(),
        gzip(),
        gulp.dest(jsDest),
        ]
    )
})
gulp.task("build-css", function(){
    const dest = 'dist/css/'
        // <link rel="stylesheet" type="text/css" href="app/static/css/taggle.css">
        // <link rel="stylesheet" type="text/css" href="other_imports/semantic/semantic-ui.min.css">
        // <link rel="stylesheet" type="text/css" href="other_imports/font-awesome.min.css" >
    const paths = [/*"app/static/css/taggle.css",*/"other_imports/semantic/semantic-ui.min.css",/*"other_imports/font-awesome.min.css"/*  "./other_imports/taggle/taggle.js"*/]
    return pump([
            gulp.src(paths),
            concat('import.css'),
            gulp.dest(dest),
            rename('import.min.css'),
            uglify(),
            gzip(),
            gulp.dest(dest),
        ]
    )
})

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
