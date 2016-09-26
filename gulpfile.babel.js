/* eslint-disable no-sync */

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import gulp from 'gulp';
import less from 'gulp-less';
import util from 'gulp-util';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import count from 'gulp-count';
import changed from 'gulp-changed';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import {spawn} from 'child_process';

let json = {
  read(file) {
    try {
      return JSON.parse(fs.readFileSync(file));
    } catch (err) {
      return null;
    }
  },

  write(file, data) {
    return fs.writeFileSync(file, JSON.stringify(data));
  }
};

let [red, green, yellow] = ['red', 'green', 'yellow']
  .map(color => util.colors[color]);

let watchers = [
  {match: 'src/**/*.json', task: 'copy:static'},
  {match: 'src/**/*.js', task: 'precompile:js'},
  {match: 'src/**/*.less', task: 'precompile:css'}
];

let resolveMap = [
  {match: '@components', path: path.join(__dirname, '/lib/components/')},
  {match: '@common', path: path.join(__dirname, '/lib/common/')},
  {match: '@config', path: path.join(__dirname, '/lib/config')}
];

gulp.task('default', ['build']);

gulp.task('dev', ['build'], () => {
  let app = spawn('electron', ['lib']);
  app.stdout.on('data', data => util.log(data.toString()));
  app.stderr.on('data', data => util.log(red(data.toString())));

  for (let {match, task} of watchers) {
    gulp.watch(match, () => {
      util.log(yellow('Rebuilding..'));
      gulp.start(task, () => {
        util.log(green('Success'));
      });
    });
  }

  util.log(green('Livereload is enabled'));
});

gulp.task('build', [
  'copy:static',
  'precompile:js',
  'precompile:css',
  'lint:gulp'
]);

gulp.task('lint:gulp', () => {
  return gulp.src(__filename)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:js', () => {
  let knownErrors = json.read('debug/errors.json') || [];
  return gulp.src('src/**/*.js')
    .pipe(changed('lib', {
      hasChanged(stream, cb, sourceFile, destPath) {
        if (knownErrors.includes(sourceFile.path)) {
          stream.push(sourceFile);
          cb();
        } else {
          changed.compareLastModifiedTime(stream, cb, sourceFile, destPath);
        }
      }
    }))
    .pipe(count('lint:js ##'))
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.results(results => {
      let markedFiles = results.filter(file => {
        return file.errorCount > 0 || file.warningCount > 0;
      });
      json.write('debug/errors.json', _.map(markedFiles, 'filePath'));
    }))
    .pipe(eslint.format());
});

gulp.task('copy:static', () => {
  return gulp.src('src/**/*.json')
    .pipe(gulp.dest('lib'));
});

gulp.task('precompile:js', ['lint:js'], () => {
  return gulp.src('src/**/*.js')
    .pipe(changed('lib', {hasChanged: changed.compareLastModifiedTime}))
    .pipe(count('precompile:js ##'))
    .pipe(plumber())
    .pipe(babel({
      resolveModuleSource(file) {
        for (let resolve of resolveMap) {
          let match = new RegExp(`^${resolve.match}(\/|$)`);
          file = file.replace(match, resolve.path);
        }
        return file;
      }
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('precompile:css', () => {
  return gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('lib'));
});
