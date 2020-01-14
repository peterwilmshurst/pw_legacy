var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

var gulpUtil = require('gulp-util');

// Static Server + watching scss/html/js files
gulp.task('serve', ['html', 'sass'], function () {

    browserSync.init({
        server: './public',
        open: false
    });

    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        //.pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

// Minify HTML
gulp.task('html', function () {
    return gulp.src(['src/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./public'));
});

// Minify javascript
gulp.task('scripts', function () {
    gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))

});

// Compress images
gulp.task('image', function () {
    gulp.src('src/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: false
                }
                ]
            })
        ]))
        .pipe(gulp.dest('public/img'));
});

// Default task
gulp.task('default', ['serve']);

// Deploy task
gulp.task('deploy', ['html', 'sass', 'scripts', 'image']);