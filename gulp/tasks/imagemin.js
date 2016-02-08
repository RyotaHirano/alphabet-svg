import gulp from 'gulp';
import pngquant from 'imagemin-pngquant';
import { imagemin, rename } from '../plugins';
import { imagemin as conf } from '../conf';

gulp.task('imagemin', () => {
  return gulp.src(conf.src)
    .pipe(imagemin(Object.assign({ use: [pngquant()] }, conf.opts)))
    .pipe(rename(path => {
      path.dirname = path.dirname.replace('img', '.');
    }))
    .pipe(gulp.dest(conf.dst));
});
