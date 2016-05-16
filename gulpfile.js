var gulp = require('gulp');
var gulpins = require('gulp-load-plugins')({
	pattern: '*'
});

var webpackConfig = require('./config/webpack');

var src = 'app/';
var dist = 'public/';

function onError (err) {
	console.log(err);
	this.emit('end');
}

gulp.task('serve', function () {
	var server = gulpins.liveServer.static(dist);
	server.start();

	// Live reload
	gulp.watch([
		src + '**/*.js',
		src + '**/*.hbs'
	], function (file){
		gulp.start('scripts', function () {
			server.notify.apply(server, [file]);
		});
	});

}).on('error', onError);

gulp.task('scripts', function () {
	return gulp.src(webpackConfig.entry)
		.pipe(gulpins.webpackStream(webpackConfig))
		.on('error', onError)
		.pipe(gulp.dest(dist + 'javascripts/'))
		.on('error', onError)
		.pipe(gulpins.connect.reload());
});

gulp.task('default', ['scripts', 'serve']);
