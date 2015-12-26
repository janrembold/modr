var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var rename = require('gulp-rename');
var del = require('del');


gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('jshint', function() {

    return gulp.src('js/**/*.js')
        .pipe( jshint() )
        .pipe( jshint.reporter(stylish) );

});

gulp.task('uglify', ['clean', 'jshint'], function () {

    return gulp.src('js/**/*.js')
        .pipe( uglify({
            preserveComments: 'license',
            compress: {
                drop_console: true
            }
        }) )
        .pipe( rename({
            suffix: '.min'
        }) )
        .pipe( size({
            title: 'uglified',
            showFiles: true
        }) )
        .pipe( size({
            title: 'gzipped',
            showFiles: true,
            gzip: true
        }) )
        .pipe( gulp.dest( 'dist/' ) );

});

gulp.task('build', ['uglify']);