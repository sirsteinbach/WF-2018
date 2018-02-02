var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir;

env = process.env.NODE_ENV || 'development';

if (env==='development'{
  outputDir='builds/development/';
} else {
  outputDir='builds/production/';
})

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style/scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + '_js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', console.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulp.dest(outputDir + '_js'))
  .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    css: outputDir + '_css', //voided the need for the .dest
    sass: 'components/sass',
    image: outputDir + '_img',
    style: 'expanded'
  })
  .on('error', console.log))
  // .pipe(gulp.dest(outputDir + '_css'))
  .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  })
})

gulp.task('json', function(){
  gulp.src(jsonSources)
  .pipe(connect.reload())
})

gulp.task('html', function(){
  gulp.src(htmlSources)
  .pipe(connect.reload())
})

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
