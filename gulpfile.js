'use strict';

const gulp             = require('gulp');
const babel            = require('gulp-babel');
const postcss          = require('gulp-postcss');
const autoprefixer     = require("autoprefixer");
const csso             = require("gulp-csso");
const minify           = require('gulp-minify');
const browserReporter  = require('postcss-browser-reporter');

const mqpacker         = require("css-mqpacker");
const precss           = require("precss");
const sourcemaps       = require('gulp-sourcemaps');

const nunjucksRender   = require('gulp-nunjucks-render');

const rename           = require('gulp-rename');

const plumber          = require('gulp-plumber');
const server           = require('browser-sync').create();
const ftp              = require('gulp-ftp');
const replace          = require('gulp-replace');
const filter           = require('gulp-filter');

const del              = require('del');
const fs               = require("fs");

const newer            = require('gulp-newer');

const concat           = require('gulp-concat');
const gulpif           = require('gulp-if');
const remember         = require('gulp-remember');

const debug            = require('gulp-debug');
const touch            = require('gulp-touch');

const htmlmin          = require('gulp-html-minifier2');
const w3cjs            = require('gulp-w3cjs');

const gutil            = require('gulp-util');
const data             = require('gulp-data');
const svgStore         = require('gulp-svgstore');
const cheerio          = require('cheerio');
const svgmin           = require('gulp-svgmin');
const through2         = require('through2');
const consolidate      = require('gulp-consolidate');

let config             = null;

const site             = 'VN';
const domain           = 'vn.wndrbase.com';

try {

	config           = require('./config.json');

	config.ftp.remotePath += domain;


}catch(e){

	console.log("config the file doesn't exists");

}

gulp.task('html', function() {

	return gulp.src('src/index.html')
		.pipe(plumber())
		.pipe(debug({title: 'html:'}))
		.pipe(nunjucksRender({
			data: {
				url: 'https://valuenetwork.live',
				site: site
			},
			path: 'src/'
		}))
		.pipe(w3cjs({
			verifyMessage: function(type, message) {

				// prevent logging error message
				if(message.indexOf('Attribute “loading” not allowed on element “img” at this point.') === 0) return false;

				// allow message to pass through
				return true;
			}
		}))
		.pipe(w3cjs.reporter())

		.pipe(replace('<link href="/css/styles.css" rel="stylesheet">', '<style>' + fs.readFileSync('build/css/styles.min.css', "utf8") + '</style>'))
		.pipe(replace('js/scripts.js', 'js/scripts.min.js?' + Date.now()))

		.pipe(gulp.dest('build'))

});

gulp.task('css', function () {

	return gulp.src('src/css/style.css')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(postcss([
				precss(),
				mqpacker(),
				browserReporter()
			]))
			.pipe(sourcemaps.write())
			.pipe(rename('styles.css'))
			.pipe(gulp.dest('build/css'))
			.pipe(postcss([
				autoprefixer({
					browsers: 'Android >= 5'
				})
			]))
			.pipe(csso())
			.pipe(rename({suffix: ".min"}))
			.pipe(gulp.dest('build/css'))

});

gulp.task('js', function() {

	return gulp.src(['src/js/js.js','src/js/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(sourcemaps.write())
		.pipe(minify({
			preserveComments: "some",
			ext : {
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest('build/js/'))

});

gulp.task('serve', function() {

	server.init({
		server: 'build',
		files: [
			{
				match: ['build/**/*.*', '!build/**/*.min.{css,js}'],
				fn: function (event, file) {
					this.reload()
				}
			}
		]
	});

});

gulp.task('clear', function() {

	return del('build');

});

gulp.task('copy', function() {

	return gulp.src(['src/**/*.*', '!src/**/*.{css,html,js}'], {since: gulp.lastRun('copy')})
			.pipe(debug({title: 'copy:'}))
			.pipe(newer('build'))
			.pipe(debug({title: 'copy:newer'}))
			.pipe(gulp.dest('build'))

});

gulp.task('ftp', function () {

//	if(!config) {

		return true;

//	}

	const f = filter('**/*.html', {restore: true});
	const cssInline = fs.readFileSync('build/css/styles.min.css', "utf8");

	return gulp.src(['build/**/*','!**/*.mp4'], {since: gulp.lastRun('ftp')})
		.pipe(debug({title: 'ftp:'}))
		.pipe(f)
		.pipe(replace('<link href="/css/styles.css" rel="stylesheet">', '<style>' + cssInline + '</style>'))
		.pipe(replace('js/scripts.js', 'js/scripts.min.js?' + Date.now()))
		.pipe(f.restore)
		.pipe(ftp(config.ftp));

});

gulp.task('watch', function() {
	gulp.watch('src/js/*.*', gulp.series('js'));
	gulp.watch('src/css/*.*', gulp.series('css'));
	gulp.watch('src/**/*.html', gulp.series('html'));
	gulp.watch(['src/**/*.*', '!src/**/*.{css,html,js}'], gulp.series('copy'));
	gulp.watch('build/**/*.*', gulp.series('ftp'));
});

gulp.task('default', gulp.series(
	'clear',
	'css',
	'js',
	'html',
	'copy',
	gulp.parallel('ftp','watch','serve')
	));