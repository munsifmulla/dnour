var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('dashboard/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dashboard/css'))
});

gulp.task('watch', function () {
    gulp.watch('dashboard/scss/*.scss', gulp.series('sass'));
})