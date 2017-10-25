// Reference : https://github.com/pgrm/vimfika/blob/master/gulpfile.js

var run = require("gulp-run");
var gulp = require("gulp");
var clean = require("gulp-clean");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", function() {
	return gulp
		.src("dist", {
			read: false
		})
		.pipe(clean());
});

gulp.task("typescript", function() {
	const tsResult = gulp.src("src/**/*.ts").pipe(run("tsc -w"));
});

gulp.task("default", ["clean", "typescript"]);
