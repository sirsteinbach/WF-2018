var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonMinify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    // htmlSources,
    // jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development'){
  outputDir='builds/development/';
  sassStyle='expanded';
} else {
  outputDir='builds/production/';
  sassStyle='compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style/scss'];
// htmlSources = [outputDir + '*.html'];
// jsonSources = [outputDir + '_js/*.json'];

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
  .pipe(gulpif(env==='production', uglify()))
  .pipe(gulp.dest(outputDir + '_js'))
  .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    css: outputDir + '_css', //voided the need for the .dest
    sass: 'components/sass',
    image: outputDir + '_img',
    style: sassStyle
  })
  .on('error', console.log))
  // .pipe(gulp.dest(outputDir + '_css'))
  .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/_js/*.json', ['json']);
    gulp.watch('builds/development/_img/**/*.*', ['images']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  })
})

gulp.task('json', function(){
  gulp.src('builds/development/_js/*.json')
  .pipe(gulpif(env==='production', jsonMinify()))
  .pipe(gulpif(env==='production', gulp.dest('builds/production/_js')))
  .pipe(connect.reload())
})

gulp.task('html', function(){
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env==='production', minifyHTML()))
  .pipe(gulpif(env==='production', gulp.dest(outputDir)))
  .pipe(connect.reload())
})

gulp.task('images', function(){
  gulp.src('builds/development/_img/**/*.*')
  .pipe(gulpif(env==='production', imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
  ])))
  .pipe(gulpif(env==='production', gulp.dest(outputDir + '_img')))
  .pipe(connect.reload())
})

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);
