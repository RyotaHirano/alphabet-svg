export const DIR = {
  PATH: '/alphabet-svg',
  SRC: 'src',
  DST: 'dst',
  BUILD: 'public',
  IMG: 'images'
};

export const sass = {
  src: [
    `${DIR.SRC}/**/*.{scss,sass}`
  ],
  dst: `${DIR.DST}${DIR.PATH}/assets/css`
};

export const eslint = {
  src: [`${DIR.SRC}/**/*.js`]
};

export const jade = {
  src: [
    `${DIR.SRC}/**/*.jade`,
    `!${DIR.SRC}/**/_**/*.jade`,
    `!${DIR.SRC}/**/_*.jade`
  ],
  dst: `${DIR.DST}${DIR.PATH}/`,
  opts: {
    pretty: true,
    basedir: `${DIR.SRC}/html`
  }
};

export const scripts = {
  browserifyOpts: {
    entries: [`./${DIR.SRC}/js/main.js`],
    transform: ['babelify']
  },
  dst: `${DIR.DST}${DIR.PATH}/assets/js`
};

export const serve = {
  open: 'external',
  reloadDebounce: 2000,
  ui: false,
  notify: false,
  startPath: DIR.PATH,
  ghostMode: false,
  server: {
    baseDir: './',
    index: `${DIR.DST}${DIR.PATH}/`,
    routes: {
      [DIR.PATH]: `${DIR.DST}${DIR.PATH}/`
    }
  }
};

export const clean = {
  path: [`${DIR.BUILD}`]
};

export const imagemin = {
  src: [`${DIR.SRC}/${DIR.IMG}/**`],
  dst: `${DIR.BUILD}/${DIR.IMG}`,
  opts: {
    //options
  }
};

export const uglify = {
  src: [`${DIR.DST}${DIR.PATH}/**/*.js`],
  dst: `${DIR.BUILD}/assets/js`
};

export const copy = {
  img: {
    src: [`${DIR.SRC}/${DIR.IMG}/**`],
    dst: `${DIR.DST}${DIR.PATH}/${DIR.IMG}`
  },
  build: {
    src: [
      `${DIR.DST}${DIR.PATH}/**`,
      `!${DIR.DST}${DIR.PATH}/js/**`,
      `!${DIR.DST}${DIR.PATH}/${DIR.IMG}`,
      `!${DIR.DST}${DIR.PATH}/${DIR.IMG}/**`
    ],
    dst: `${DIR.BUILD}`
  }
};
