const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const eslint = require('gulp-eslint')
const rollup = require('gulp-better-rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const browserSync = require('browser-sync').create()
const json = require('rollup-plugin-json')
const auth = require('basic-auth')
const compare = require('tsscmp')
const axios = require('axios')
const creds = require('./../auth.json')
const apiToken = require('./../apiToken')

gulp.task('sass', () => {
    return gulp.src('./scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
})

gulp.task('watch-scss-init', () => {
    gulp.watch([
        './scss/*.sass',
        './scss/*.scss',
        './scss/*.css'
    ], gulp.series('sass'))
})

gulp.task('watch-scss', gulp.series(['sass', 'watch-scss-init']))

gulp.task('lint', () => {
    return gulp.src('./js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('rollup', () => {
    return gulp.src('./js/main.js')
    .pipe(rollup({
        plugins: [
            json(),
            resolve({
                jsnext: true,
                main: true,
                module: true
            }),commonjs({
                include: './node_modules/**',
                browser: true
            }),
            babel({
                exclude: './node_modules',
                presets: [
                    '@babel/preset-env'
                ]
            })    
        ]
    }, {
        format: 'iife',
        file: 'index.js'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch-js-init', () => {
    gulp.watch([
        './js/*.js'
    ], gulp.series('lint', 'rollup')).on('change', browserSync.reload)
})


const check = (name, pass) => {
    if (creds[name] && compare(pass, creds[name])) {
        return true
    }
    return false
}

gulp.task('watch-js', gulp.series(['lint', 'rollup', 'watch-js-init']))

gulp.task('default', async function(){
    browserSync.init({
        server: './',
        port: 8080,        
        middleware: [
            {
                route: "/api/login",
                handle: function (req, res, next) {
                    const credentials = auth(req)
                    if (credentials && check(credentials.name, credentials.pass)) {
                        res.end(JSON.stringify({
                            status: 'SUCCESS'
                        }))
                    } else {
                        res.end(JSON.stringify({
                            status: 'ERROR'
                        }))
                    }
                }
            },{
                route: "/api/form",
                handle: function (req, res, next) {
                    const credentials = auth(req)
                    let jsonData = null
                    let jsonString = ''
                    req.on('data', (data) => {
                        jsonString += data
                    });
                    req.on('end', function() {
                        jsonData = JSON.parse(jsonString);
                        if (credentials && check(credentials.name, credentials.pass)) {
                            axios.post(
                                'https://api-uswest.graphcms.com/v1/ck71ll9vz3mye01cy9khd4ks6/master',
                                jsonData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${apiToken}`
                                    }
                                }
                            ).then((response) => {
                                if (response.data.errors) {
                                    console.log(response.data.errors)
                                    res.end(JSON.stringify({
                                        status: 'ERROR',
                                        reason: 'Bad request: ' + response.data.errors[0].message
                                    }))
                                } else {
                                    res.end(JSON.stringify({
                                        status: 'SUCCESS'
                                    }))
                                }
                            }).catch((error) => {
                                console.log(error)
                                res.end(JSON.stringify({
                                    status: 'ERROR',
                                    reason: 'Bad request.'
                                }))
                            })
                        } else {
                            res.end(JSON.stringify({
                                status: 'ERROR',
                                reason: 'Invalid credentials.'
                            }))
                        }
                    });
                }
            }
        ]
    })
}, 'watch-scss', 'watch-js')

gulp.task('new-default', gulp.parallel(() => {
    browserSync.init({
        server: './',
        port: 8080
    })
}, 'watch-scss', 'watch-js'))