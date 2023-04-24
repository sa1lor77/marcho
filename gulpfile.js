const {src, dest, watch,parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); //все файлы объединяет в один
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function scripts(){
  return src ([
    'app/js/main.js'
    // 'app/js/*.js',
    // '!app/js/main.min.js' //все файлы js кроме этого файла(исключает этот файл)
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles(){   
  return src('app/scss/style.scss')
    .pipe(autoprefixer({ovverrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))  
    .pipe(dest('app/css')) 
    .pipe(browserSync.stream())
}

function watching (){  //наблюдение за изменением файлов
  watch(['app/scss/style.scss'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/*.html']).on('change', browserSync.reload)
}

function browsersync() {  //обновляет страницу браузера при изменении и корректировке кода
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function building (){
  return src([
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/**/*.html'
  ], {base : 'app'}) //сохранить базовую структуру, что бы всю струтктуру проекта сохранило
    .pipe(dest('dist'))
}

function cleanDist (){
  return src('dist')
    .pipe(clean())
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching; 
exports.browsersync = browsersync;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);