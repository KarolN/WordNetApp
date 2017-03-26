/**
 * Created by karol on 26.03.17.
 */

var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function(){
    gulp.src("./app/assets/scss/site.scss")
        .pipe(sass({
            includePaths: ["./app/scss/site.scss", "./app/bower_components/bootstrap-sass/assets/stylesheets"]
        }).on("error", sass.logError))
        .pipe(gulp.dest("./app/assets/css"));
});