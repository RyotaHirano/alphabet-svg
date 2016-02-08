import gulp from 'gulp';
import { plumber, notify, eslint } from '../plugins';
import { eslint as conf } from '../conf';

gulp.task('eslint', () => {
  return gulp.src(conf.src)
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(eslint(conf.opts))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
