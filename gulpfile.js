var gulp = require("gulp");
var browserify = require("browserify");
var babel = require("gulp-babel");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

gulp.task("build-node", function() {
    return gulp.src("src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"))
});

gulp.task("build-browser", function() {
    var b = browserify({
        entries: "./dist/time.js",
        debug: true
    });
    
    return b.bundle()
        .pipe(source("time.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("dist/browser"));
});

gulp.task("build", ["build-browser", "build-node"]);

gulp.task("default", ["build"]);
