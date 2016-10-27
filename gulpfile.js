require('es6-promise').polyfill();
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var size = require('gulp-size');
var uglify = require('gulp-uglify');

function bundle () {

    return new Promise(function (resolve, reject) {
        browserify({debug:true, entries: ['./app/main.ts']}) 
        .plugin(tsify, { noImplicitAny: true })
        //transform
        .bundle()
        .on('error', function (e){
            gutil.leg(e);
        })
        .pipe(source('bundle.js'))
        .on('error', gutil.log)
        .pipe(buffer())
        .pipe(uglify()) 
        .pipe(gulp.dest('./dist')
        .on("finish", resolve))
        .pipe(size());
    });
}

gulp.task('watch', function(){

    browserSync.init({
        server: "./",
        logFileChanges: false
    });

    gulp.watch('./app/**.ts').on('change', ()=>{ bundle().then(() => browserSync.reload())});
})