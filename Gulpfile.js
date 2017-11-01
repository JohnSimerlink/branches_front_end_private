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
var babel = require('gulp-babel')
var mocha = require('gulp-mocha')
var typescript = require('gulp-typescript')
var webpack = require('webpack-stream')
var runSequence = require('run-sequence')
var CodeAndTestConfig = require('./webpack.config.codeandtest.rules.js')
//for the files that error out when used in ./vendor.js
gulp.task("build-funny-modules", function(){
    const jsDest = 'dist/funny/'
    const paths = ["./other_imports/taggle/jquery-1.10.1.js",  "./other_imports/taggle/taggle.js"/**/]
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

gulp.task("build-funny-modules2", function(){
    const jsDest = 'dist/build2/'
    const paths = ["./other_imports/taggle/jquery-1.10.1.js",  "./other_imports/taggle/taggle.js",/* "/dist/regenerator.js", "/dist/vendor.js", "/dist/build.js"*/]
    return  gulp.src(paths)
            .pipe(babel({presets: ['env']}))
            .pipe(concat('build2.js'))
            .pipe(gulp.dest(jsDest))
            .pipe(rename('build2.min.js'))
            .pipe(uglify())
            .pipe(gzip())
            .pipe(gulp.dest(jsDest))
})

gulp.task("build-css", function(){
    const dest = 'dist/css/'
        // <link rel="stylesheet" type="text/css" href="app/static/css/taggle.css">
        // <link rel="stylesheet" type="text/css" href="other_imports/semantic/semantic-ui.min.css">
        // <link rel="stylesheet" type="text/css" href="other_imports/font-awesome.min.css" >
    const paths = ["app/static/css/taggle.css",/*"app/static/css/taggle.css",*/"other_imports/semantic/semantic-ui.min.css",/*"other_imports/font-awesome.min.css"/*  "./other_imports/taggle/taggle.js"*/]
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

function handleError(err) {
    console.log(err.toString())
    this.emit('end')
}

const paths = {
    scripts: 'app/**/*.ts',
    tests: 'test/*.ts',
}

gulp.task('test-watch', function() {
    gulp.start('build-and-test')
    watch([paths.scripts, paths.tests], batch(function (events, done) {
        gulp.start('build-and-test',done)
    }))
    // gulp.watch(paths.scripts, ["test2"])
})

gulp.task('test', function() {
    test()
})
gulp.task('build', function() {
    build()
})
gulp.task('build-and-test', function(done) {
    console.log('build and test!')
    runSequence('build','test', function() {
        done()
    })
})

// function test(){
//     console.log('rerunning tests! . . .');
//     run("mocha --compilers js:babel-register --require babel-polyfill").exec() //, function(err, out, code){
// }

function build() {
    var tsProject = typescript.createProject('./tsconfig.json')
    console.log('building!')
    return gulp.src(paths.scripts, {base: '.'})
        .pipe(tsProject())
        /*flush to disk*/ // necessary or else mocha won't be able to find the files
        .pipe(gulp.dest('.'))

}
function test(){
    console.log('testing!')
    var tsProject = typescript.createProject('./tsconfig.json')
    console.log("running gulp test")
    return gulp.src(paths.tests, {base: '.'})
        // .pipe(
        // webpack({
        //     module: {
        //         rules: CodeAndTestConfig.rules,
        //     },
        //     resolve: {
        //         extensions: CodeAndTestConfig.extensions
        //     }
        // }))
        .pipe(tsProject())
        /*flush to disk*/ // necessary or else mocha won't be able to find the files
        .pipe(gulp.dest('.'))
        .pipe(
            mocha({
                reporter: 'spec',
                // compilers: ['js:babel-register', /*'ts:ts-node/register'*/],
                // require: ['babel-polyfill', /*'ts-node/register'*/],
            })
            .on('error', handleError)
        )
}
function testfunc(){
    console.log("THIS IS ", this, "ARGUMENTS IS", arguments)
    return this
}