var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var browserSync = require('browser-sync').create();
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');

function bundle (bundler) {
    return bundler
    .plugin(tsify, { noImplicitAny: true })
    .bundle()
    .on('error', function (e){
        gutil.leg(e);
    })
    .pipe(source('bundle.js'))
    //.pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    //.pipe(uglify())
    .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
    //.pipe(browserSync.stream());
}

gulp.task('watch', function(){
    var watcher = watchify(browserify(
        {
            entries: ['./app/main.ts'],
            debug: true
        }, 
        watchify.args));

    bundle(watcher);
    watcher.on('update', function(){
        bundle(watcher);
    })
    watcher.on('log', gutil.log);

    browserSync.init({
        server: "./",
        logFileChanges: false
    })

    gulp.watch('./dist/*.js').on('change', browserSync.reload);
})