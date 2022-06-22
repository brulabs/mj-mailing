var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var mjml = require('gulp-mjml');
var mjmlEngine = require('mjml');
var log = require('fancy-log');
var config = {
    'src': 'src/',
    'dest': 'build/'
};

// Convert mjml code into html code
function html() {
    return gulp.src(config.src + '*.html').pipe($.mjml(mjmlEngine, {
        validationLevel: 'strict',
    }).on('error', function(error) {
        log.error(error.message);
        this.emit('end');
    })).pipe($.htmlBeautify({
        indentSize: 4,
    })).pipe(gulp.dest(config.dest)).pipe(browserSync.stream());
}

// Serve compiled files
function serve(done) {
    browserSync.init({
        server: config.dest,
        notify: false,
        snippetOptions: {
            rule: {
                match: /<\/body>/i
            }
        }
    });
    done();
}

// Watch files for changes
function watch(done) {
    gulp.watch(config.src + '*.mjml', html);
    done();
}

// Gulp tasks
gulp.task('build', html);
gulp.task('default', gulp.series(html, gulp.parallel(serve, watch)));
