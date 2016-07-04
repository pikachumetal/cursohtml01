'use strict';

var gulp = require('gulp'),
  sassLint = require('gulp-sass-lint'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  jshintStylish = require('jshint-stylish'),
  sourcemaps = require('gulp-sourcemaps'),
  runner = require('run-sequence'),
  moduleImporter = require('sass-module-importer'),
  eslint = require('gulp-eslint');

gulp.task('sasslint', function () {
  return gulp.src(['scss/**/*.s+(a|c)ss', "!./scss/base/_normalize.scss"])
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('jshint', function () {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', function () {
    return gulp.src('./js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('sass:client', function () {
  var client = "./scss/clients/_client01.s+(a|c)ss";

  return gulp.src(client)
    .pipe(rename('_client.s+(a|c)ss'))
    .pipe(gulp.dest('./scss/'));
});

gulp.task('sass-dev', function () {
  var scss = ["./scss/**/*.s+(a|c)ss", "!./scss/clients/**/*.s+(a|c)ss"];

  return gulp.src(scss)
    .pipe(sass({ importer: moduleImporter() }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass', function () {
  var scss = ["./scss/**/*.s+(a|c)ss", "!./scss/clients/**/*.s+(a|c)ss"];

  return gulp.src(scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: moduleImporter() }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./scss/**/*.s+(a|c)ss', ['sass']);
});

gulp.task('js', function () {
  return gulp.src('./js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./jsdist'));
});

gulp.task('default', function () {
  runner('sasslint', 'lint', 'sass-dev', 'js');
});