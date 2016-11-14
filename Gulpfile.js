var gulp = require('gulp')
var sass = require('gulp-sass')
var webserver = require('gulp-webserver')
var concat = require('gulp-concat')
// var uglify = require('gulp-uglify')
var minify = require('gulp-minify')
// var minifyCss = require('gulp-minify-css')
var sourcemaps = require('gulp-sourcemaps')

// Rutas archivos
var sass_src = 'css/'
var css_src = 'css/'
// var css_min_src = 'WebContent_vo15/css/'
var js_src = 'js/'
// var js_jquery_src = 'WebSrc/js/jquery/'
// var js_vendor_src = 'WebSrc/js/vendor/'
// var js_min_src = 'WebContent_vo15/js/'
// var js_jquery_min_src = 'WebContent_vo15/js/jquery/'
// var js_vendor_min_src = 'WebContent_vo15/js/vendor/'

gulp.task('styles', function () {
  gulp.src(sass_src + '*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(css_src))
// .pipe(minifyCss({compatibility: 'ie8'}))
// .pipe(concat('style.min.css')) 
// .pipe(sourcemaps.write('.'))
// .pipe(gulp.dest(css_min_src))
})

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      fallback: 'index.html'
    }))
})
// gulp.task('css', function() {
//     gulp.src(css_src + '*.css')
//         .pipe(sourcemaps.init())
//         .pipe(minifyCss({compatibility: 'ie8'}))
//         .pipe(concat('style.min.css')) 
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest(css_min_src))
// })

// gulp.task('jsmin', function () {
//   gulp.src(js_src + '*.js')
//     .pipe(sourcemaps.init())
//     .pipe(concat('scripts.js'))
//     .pipe(minify())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(js_src))
// })

// gulp.task('jsconcat', function(){
//     gulp.src(js_src + '/min/*-min.js')
//     .pipe(sourcemaps.init())
//     .pipe(concat('scripts.min.js')) 
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(js_min_src))
// })

// gulp.task('jsjquerymin', function(){
//     gulp.src(js_jquery_src + '*.js')
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest(js_jquery_min_src))
// })
// gulp.task('jsvendormin', function(){
//     gulp.src(js_vendor_src + '*.js')
//         .pipe(sourcemaps.init())
//         .pipe(concat('vendor.min.js')) 
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest(js_vendor_min_src))
// })

// Watch task
gulp.task('watch', function () {
  gulp.watch(sass_src + '*.scss', ['styles'])
// gulp.watch(css_src + '*.css',['css'])
// gulp.watch(js_src + '*.js',['jsmin'])
// gulp.watch(js_src + '/min/*.js',['jsconcat'])
// gulp.watch(js_jquery_src + '*.js',['jsjquerymin'])
// gulp.watch(js_vendor_src + '*.js',['jsvendormin'])
})

gulp.task('default', ['watch', 'styles', 'webserver'])
