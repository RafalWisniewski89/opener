/* modules */
var gulp                = require('gulp'),
    bSync               = require('browser-sync').create(),
    runSequence         = require("run-sequence"),
    del                 = require('del'),
    cache               = require('gulp-cache'),
    rename              = require("gulp-rename"),   
    plumber             = require('gulp-plumber'), 
    
    // sass & js
    sass                = require('gulp-sass'),
    autoprefixer        = require('gulp-autoprefixer'),
    uglify              = require('gulp-uglify'),   
    
    // pug
    prettify            = require('gulp-prettify'),
    useref              = require('gulp-useref'),    
    
    // linters
    jshint              = require('gulp-jshint'),
    stylish             = require('jshint-stylish'),
    sassLint            = require('gulp-sass-lint');
    

/* project paths */
    // source paths
    srcDev              = 'src',
    srcMainTemplates    = srcDev + '/templates/*.html',
    srcTemplates        = srcDev + '/templates/**/*.html',
    srcImg              = srcDev + '/img/**/*.+(png|jpg|gif|svg|ico)',
    srcSass             = srcDev + '/scss/**/*.scss',
    srcJs               = srcDev + '/js/**/*.js',
    srcFonts            = srcDev + '/fonts/**/*',
    
    // destination paths
    destDev             = 'public',
    destImg             = destDev + '/img',
    destCss             = destDev + '/css',
    destJs              = destDev + '/js',
    destFonts           = destDev + '/fonts';

gulp.task('bSync', function () {
    bSync.init({
        server: {
            baseDir: destDev
        }
    });
});

gulp.task('template', function () {
    return gulp.src(srcMainTemplates)
        .pipe(plumber(function(error){
            console.log("\nError happend on TEMPLATE! \n\n", error.message);
            this.emit('end');
        })) 
        .pipe(prettify({indent_size: 4}))
        .pipe(useref())
        .pipe(plumber.stop())
        .pipe(gulp.dest(destDev))        
        .pipe(bSync.stream());
});

gulp.task('sass', function () {
    return gulp.src(srcSass) 
        .pipe(plumber(function(error){
            console.log("\nError happend on SASS! \n\n", error.message);
            this.emit('end');
        }))  
        .pipe(sass({
            outputStyle: "expanded",
            indentWidth: 4
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(autoprefixer({
            browsers: 'last 5 versions',
            cascade: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(destCss))
        .pipe(bSync.stream());
});

gulp.task('sass:minify', function () {
    return gulp.src(srcSass)   
        .pipe(plumber(function(error){
            console.log("\nError happend on SASS! \n\n", error.message);
            this.emit('end');
        }))     
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(autoprefixer({
            browsers: 'last 5 versions',
            cascade: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(destCss));
});

gulp.task("sass-lint", function () {
    return gulp.src(srcSass)
        .pipe(sassLint({
            rules: {
                "final-newline": 0,
                "indentation": 0,
                "no-css-comments": 0,
                "empty-line-between-blocks": 0,
                "force-pseudo-nesting": 0,
                "pseudo-element": 0,
                "leading-zero": 0,
                "property-sort-order": 0,
                "trailing-semicolon": 1,
                "no-warn": 2,
                "url-quotes": 0,
                "class-name-format": 0,
                "nesting-depth": 0,
                "no-ids": 0,
                "no-color-literals": 0
            },
            options: {
                "formatter": "table",
                 "max-warnings": 50
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('images', function () {
    return gulp.src(srcImg)
        .pipe(gulp.dest(destImg))
        .pipe(bSync.stream());
});

gulp.task('fonts', function () {
    return gulp.src(srcFonts)
        .pipe(gulp.dest(destFonts));
});

gulp.task('js', function () {
    return gulp.src(srcJs)  
        .pipe(plumber(function (error) {
            console.log("\nError happend on JS! \n\n", error.message);
            this.emit('end');
        })) 
        .pipe(gulp.dest(destJs))
        .pipe(plumber.stop())
        .pipe(bSync.stream());
});

gulp.task('js:uglify', function () {
    return gulp.src(srcJs)
        .pipe(plumber(function(error){
            console.log("\nError happend on JS! \n\n", error.message);
            this.emit('end');
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(uglify({
            compress: {
                hoist_vars: true
            }
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(destJs));
});

gulp.task('js-lint', function () {
    return gulp.src(srcJs)  
        .pipe(jshint('.jshintrc', {
            fail: true
        }))
        .pipe(jshint.reporter(stylish))  
});

gulp.task('clean', function () {
    return del.sync(destDev);
});

gulp.task('cache', function (callback) {
    return cache.clearAll(callback);
});


gulp.task('default', function () {
    runSequence('clean','cache','template','sass','images','js','fonts','bSync');
    gulp.watch(srcTemplates, ['template'])
    gulp.watch(srcSass, ['sass']);
    gulp.watch(srcImg, ['images']);
    gulp.watch(srcJs, ['js']);
    gulp.watch(srcFonts, ['fonts']).on('change', bSync.reload);     
});

gulp.task('dist', function () {
    runSequence('clean','cache','template','sass:minify','images','js:uglify','fonts');
});