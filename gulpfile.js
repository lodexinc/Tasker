var gulp = require('gulp');
var express = require('gulp-express');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('browserify', function() {
	gulp.src('client/js/app.js')
		.pipe(browserify())
		.pipe(rename('index.js'))
		.pipe(gulp.dest('client/js/bin'));
});

gulp.task('serverRestart', function() {
	express.run(['server/index.js']);
});

gulp.task('browserReload', function() {
	gulp.src('')
		.pipe(express.notify());	
});

gulp.task('default', ['serverRestart'], function() {
	gulp.watch('./server/**/*.js', ['serverRestart', 'browserReload']);
	gulp.watch('./client/js/*.js', ['browserify', 'serverRestart', 'browserReload']);
});
