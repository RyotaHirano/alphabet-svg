import gulp from 'gulp';
import { sass, plumber, notify, rename } from '../plugins';
import { sass as conf } from '../conf';

gulp.task('sass', () => {
  return gulp.src(conf.src)
    .pipe(plumber(
      {
        errorHandler: notify.onError('<%= error.message %>')
      }
    ))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: './'
    }))
    .pipe(gulp.dest(conf.dst));
});
