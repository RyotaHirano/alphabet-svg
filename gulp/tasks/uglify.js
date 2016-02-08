import gulp from 'gulp';
import { uglify, rename } from '../plugins';
import { uglify as conf } from '../conf';

gulp.task('uglify', () => {
  return gulp.src(conf.src)
    .pipe(uglify())
    .pipe(rename(path => {
      path.dirname = path.dirname.replace('js', '.');
    }))
    .pipe(gulp.dest(conf.dst));
});
