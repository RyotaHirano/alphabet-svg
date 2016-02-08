import gulp from 'gulp';
import { copy as conf } from '../conf';

gulp.task('copy:img', () => {
  return gulp.src(conf.img.src)
    .pipe(gulp.dest(conf.img.dst));
});

gulp.task('copy:build', () => {
  return gulp.src(conf.build.src)
    .pipe(gulp.dest(conf.build.dst));
});
