var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

/** Cleans dist directory **/
gulp.task('clean', function() {
  return gulp.src(['dist/*'], { read: false }).pipe(clean());
});

/** Lints JS **/
gulp.task('jshint', function() {
  return gulp.src(['src/*.js', '!src/*.spec.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

/** Minifies JS **/
gulp.task('uglify', function() {
  return gulp.src(['src/*.js', '!src/*.spec.js'])
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest('dist'));
});

/** Runs the 'clean' task followed by the other tasks in parallel. **/
gulp.task('build', ['clean', 'jshint', 'test', 'uglify']);

/** Runs unittests with Karma **/
gulp.task('test', function() {
  gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/app.js',
    'src/*.js'
  ]).pipe(karma({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    captureTimeout: 10000,
    colors: true,
    port: 9876,
    action: 'run'
  }));
});

/** Watches for file changes **/
gulp.task('watch', function() {
  gulp.watch('src/*.js', ['jshint', 'test']);
});
