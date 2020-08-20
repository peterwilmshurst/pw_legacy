// gulpfile.babel.js
import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-sass";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";
import include from "gulp-include";
import del from 'del';

// options
const htmlOptions = { collapseWhitespace: 'true' };
const sassOptions = { outputStyle: 'compressed', errLogToConsole: true };
const includeOptions = { extensions: ['js', 'html'], hardFail: true, separateInputs: true };
const jsOptions = { presets: ["@babel/preset-env"] };

// functions
function html() {
    return gulp.src(['./src/**/*.html',
        '!./src/partials/*.html'])
        .pipe(include(includeOptions))
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest('./dist/'));
};

function js() {
    return gulp.src('./src/js/main.js')
        .pipe(include(includeOptions))
        .pipe(babel(jsOptions))
        .pipe(gulp.dest('./dist/js'));
};

function css() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass(sassOptions))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({ stream: true }));
};

function images() {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.reload({ stream: true }));
};

function clean() {
   return del(['dist/**/*']);
};

function copy() {
    return gulp.src('./src/docs/**/*')
        .pipe(gulp.dest('./dist/docs'))
        .pipe(browserSync.reload({ stream: true }));
};

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: 'index.html'
        },
        notify: false,
        injectChanges: true
    });
    gulp.watch('./src/**/*.html', gulp.series('html'));
    gulp.watch('./src/js/**/*.js', gulp.series('js'));
    gulp.watch('./src/scss/**/*', gulp.series('css'));
    gulp.watch('./src/images/**/*', gulp.series('images'));
    gulp.watch('./src/docs/**/*', gulp.series('copy'));
    gulp.watch('./dist/*').on('change', browserSync.reload);
});

gulp.task('clean', clean);
gulp.task('html', html);
gulp.task('js', js);
gulp.task('css', css);
gulp.task('images', images);
gulp.task('copy', copy);

// watch task
gulp.task('default', gulp.series('serve'));

// deploy task
gulp.task('deploy', gulp.parallel(html, js, css, images, copy));
