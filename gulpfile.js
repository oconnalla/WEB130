const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');


gulp.task('sass', ()=>{
    return gulp.src('./scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
})

gulp.task('watch-scss-init', ()=>{
    gulp.watch([
        './scss/*.scss',
        './scss/*.sass',
        './scss/*.css',
    ], gulp.series('sass'));   
})

gulp.task('watch-sass', gulp.series(['sass', 'watch-scss-init']));

gulp.task('lint', () => {
    return gulp.src('./js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})

gulp.task('rollup', () => {
    return gulp.src('./js/index.js')
    .pipe(rollup({
        plugins: [
            babel({
                exclude: './node_modules',
                presets: [
                    '@babel/preset-env'
                ]
            })
        ]
    }, {
        format: 'iife'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch-js', () => {
    gulp.watch([
        './js/*.js'
    ], gulp.series('lint'));
})

gulp.task('default', gulp.parallel(['watch-sass', 'watch-js']))