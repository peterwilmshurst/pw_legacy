// gulpfile.babel.js
import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-sass";
import sassLint from "gulp-sass-lint";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";
import include from "gulp-include";
import replace from 'gulp-replace';
import del from "del";


// Options
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

function sasslint() {
    return gulp.src('./src/scss/*.s+(a|c)ss')
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
  };

function img() {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.reload({ stream: true }))
}

function clean() {
    return del(['dist/**/*']);
};

function cachebust (){
    let cbString = new Date().getTime();
    return gulp.src(['./dist/**/*.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(gulp.dest('./dist/'));
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
    gulp.watch('./src/scss/*.s+(a|c)ss', gulp.series('sasslint'));
    gulp.watch('./src/scss/**/*', gulp.series('css'));
    gulp.watch('./src/img/**/*', gulp.series('img'));
    gulp.watch('./dist/*').on('change', browserSync.reload);
});

gulp.task('clean', clean);
gulp.task('html', html);
gulp.task('sasslint', sasslint);
gulp.task('js', js);
gulp.task('css', css);
gulp.task('img', img);
gulp.task('cachebust', cachebust);

// watch task
gulp.task('default', gulp.series('serve'));

// deploy task
gulp.task('deploy', 
gulp.series(
    gulp.parallel(html, js, css, img),
    cachebust
)
);