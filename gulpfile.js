const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Move bootstrap scss into our project
gulp.task('initbs', function() {
    return gulp.src(['node_modules/bootstrap/scss/*', 'node_modules/bootstrap/scss/mixins/*', 'node_modules/bootstrap/scss/utilities/*'])
        .pipe(gulp.dest("src/assets/scss/bootstrap/"))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['src/assets/scss/*.scss', 'src/assets/scss/layout/*.scss', 'src/assets/scss/modules/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest("src/assets/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"  
    });

    gulp.watch(['src/assets/scss/*.scss', 'src/assets/scss/layout/*.scss', 'src/assets/scss/modules/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Prefix / minify CSS
gulp.task('prefix', () =>
    gulp.src('src/assets/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/assets/css'))
);

// Minify CSS
gulp.task('minify-css', () => {
  return gulp.src('src/assets/css/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('default', ['js', 'serve']);

