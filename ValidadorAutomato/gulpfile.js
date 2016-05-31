/// <binding BeforeBuild='min' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    less = require('gulp-less'),
    path = require('path'),
    plumber = require('gulp-plumber');

var paths = {
    webroot: "./wwwroot/"
};

paths.jsroot = paths.webroot + "js/";
paths.etcjs = paths.webroot + "js/etc/**/*.js";
paths.sigmajs = paths.webroot + "js/sigma/**/*.js";
paths.automatojs = paths.webroot + "js/automato/**/*.js";
paths.automatoroot = paths.webroot + "js/automato/";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.cssroot = paths.webroot + "css/";
paths.less = paths.webroot + "css/**/*.less";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:sigma", function () {
    return gulp.src([paths.sigmajs], { base: "." })
        .pipe(concat(paths.jsroot + "sigma.min.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:automato", function () {
    return gulp.src([paths.automatoroot + "automato.afbase.js",
    paths.automatoroot + "automato.renderer_base.js",
    paths.automatoroot + "automato.mensagens.js",
    paths.automatoroot + "automato.motivos_rejeicao.js",
    paths.automatoroot + "automato.transicao.js",
    paths.automatoroot + "automato.no.js",
    paths.automatoroot + "automato.afd.js",
    paths.automatoroot + "automato.afnd.js",
    paths.automatoroot + "automato.ap.js",
    paths.automatoroot + "automato.afd.renderer.default.js",
    paths.automatoroot + "automato.factory.js", ], { base: "." })
        .pipe(concat(paths.jsroot + "automato.min.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:etc", function () {
    return gulp.src([paths.etcjs, "!*min.js"], { base: "." })
        .pipe(concat(paths.jsroot + "etc.min.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:sigma", "min:automato", "min:etc", "less", "min:css"]);

gulp.task('less', function () {
    return gulp.src(paths.less)
    .pipe(plumber())
      .pipe(less({
          paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(gulp.dest(paths.cssroot));
});
