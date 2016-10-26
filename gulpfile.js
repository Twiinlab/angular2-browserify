var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var browserSync = require('browser-sync').create();
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');

function bundle () {

    var promise = new Promise();
    
    browserify({debug:true, entries: ['./app/main.ts']}) 
    .plugin(tsify, { noImplicitAny: true })
    //.pipe(uglify())
    //transform
    .bundle()
    .on('error', function (e){
        gutil.leg(e);
    })
    .pipe(source('bundle.js'))
    
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist').on("finish", ()=>{

        promise.resolve();
    }));

    return promise;
}

gulp.task('watch', function(){
    /*var watcher = watchify(browserify(
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
*/
    browserSync.init({
        server: "./",
        logFileChanges: false
    });

    gulp.watch('./app/*.ts').on('change', ()=>{ bundle().then(() => browserSync.reload())});
})