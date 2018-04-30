const fs = require('fs');
gulp = require('gulp'),
rename = require('gulp-rename'),
sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
cssnext = require('postcss-cssnext'),
stylelint = require('stylelint'),
reporter = require('postcss-reporter'),
sourcemaps = require('gulp-sourcemaps'),
postcss_mixins = require('postcss-mixins'),
filter = require("gulp-filter"),
browserSync = require('browser-sync'),
plumber = require('gulp-plumber');

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
  gulp.watch('dist/**/*').on('change', browserSync.reload);
});

gulp.task('reload', function() {
  browserSync.reload();
});

var paths = {
  'scss': 'sass/',
  'css': 'dist/css/'
}

gulp.task('scss', function() {
  return gulp.src(paths.scss + '**/*.scss')
  .pipe(plumber({
    errorHandler: function(err) {
      console.log(err.messageFormatted);
      this.emit('end');
    }
  }))
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(postcss([
    cssnext({
      browsers: 'last 2 versions',
      features: {
        rem: false
      }
    }),
    postcss_mixins(),
    stylelint(),
    reporter({clearMessages: true})
  ]))
  .pipe(gulp.dest(paths.css))
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['scss']);
});

gulp.task('default', ['watch', 'browser-sync', 'reload']);
