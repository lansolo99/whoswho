// REQUIREMENTS

var gulp               = require('gulp');
var sass               = require('gulp-sass');
var autoprefixer       = require('gulp-autoprefixer');
var cleanCSS           = require('gulp-clean-css');
var del                = require('del');
var git                = require('gulp-git');
var gitignore          = require('gulp-gitignore');
var browserSync        = require('browser-sync').create();
var reload             = browserSync.reload;
var runSequence        = require('run-sequence');
var sourcemaps         = require('gulp-sourcemaps');
var stripDebug         = require('gulp-strip-debug');
var strip              = require('gulp-strip-comments');
var stripCssComments   = require('gulp-strip-css-comments');
//var removeHtmlComments = require('gulp-remove-html-comments');
var imagemin           = require('gulp-imagemin');
var useref             = require('gulp-useref');
var cleanCSS           = require('gulp-clean-css');
var uglify             = require('gulp-uglify');
var pump               = require('pump');
var iconfont = require("gulp-iconfont");
var iconfontCss = require("gulp-iconfont-css");

// VARS

var projectURL = 'localhost:8888';

//////////////////////////////////////////////

// TESTING

gulp.task('hello', function() {
  console.log('Hello');
});


// DEL

gulp.task('clean:dist', function() {
  return del.sync('dist');
})


// SASS + Autoprefixer

gulp.task('sass', function(){

  return gulp.src('src/scss/**/*.scss')
      .pipe( sourcemaps.init() ) // Gets all files ending with .scss /scss dir
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
      .pipe( sourcemaps.write( { includeContent: false } ) )
      .pipe( sourcemaps.init( { loadMaps: true } ) )
      .pipe(autoprefixer({
        cascade: true,
        remove: false,
        browsers: ['last 2 versions', 'safari 5', 'opera 12.1', 'iOS 7', 'iOS 6', 'last 3 iOS versions', 'android 4']
      }))
      .pipe( sourcemaps.write ('./') )
      .pipe(gulp.dest('src/css/')) // Outputs it in the css folder
      .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }))
});


// BROWSER-SYNC

gulp.task('browserSync',function(){

  browserSync.init({

    // Dynamic (use with mamp)
     //proxy: 'localhost:8888',

    // Static
    server: {
          baseDir: "./src"

      },

    open: true,
    injectChanges: true,
    notify: false


  });

});



// WATCHERS
gulp.task('watch', ['sass'],  function(done) {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
  done();
})


// Glyphicons
gulp.task("glyphicons", function() {
  return gulp
    .src("src/glyphicons/**/*")
    .pipe(
      iconfontCss({
        fontName: "icons",
        targetPath: '../scss/_icons.scss', // relative to dest fonts
        fontPath: '../fonts/' // relative to scss file
      })
    )
    .pipe(
      iconfont({
        fontName: "icons"
      })
    )
    .pipe(gulp.dest("src/fonts"));
});


// WebPages copy

gulp.task('webPagesCopy', function() {
  return gulp.src('src/*.{html,php}')
  .pipe(useref())
  .pipe(gulp.dest('dist/'))
  // .pipe(removeHtmlComments())
  .pipe(gulp.dest('dist/'))
})


// Minify CSS

gulp.task('minify-css', () => {
  return gulp.src('dist/css/styles.min.css')
    .pipe(stripCssComments())
    .pipe(cleanCSS({debug: true}, function(details) {
      console.log(details.name + ': ' + details.stats.originalSize);
      console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
  .pipe(gulp.dest('dist/css'));
});


// Strip JS
gulp.task('strip-js', function() {
  return gulp.src('dist/js/app.js')
  .pipe(stripDebug())
  .pipe(strip())
  .pipe(gulp.dest('dist/js'))
})


// Minimify JS
gulp.task('minimify-js', function (cb) {
  pump([
      gulp.src('dist/js/app.js'),
      uglify(),
      gulp.dest('dist/js')
    ],
    cb
  );
});


// Img Copy

gulp.task('imgCopy', function() {
  return gulp.src('src/images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
})


// Fonts copy

gulp.task('fontsCopy', function() {
  return gulp.src('src/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
})


// JS Copy (jquery)

gulp.task('jqueryCopy', function() {
  // return gulp.src(['src/js/jquery-3.2.1.min.js','src/js/YouTubePopUp.jquery.js'])
  return gulp.src('src/js/jquery-3.2.1.min.js')
  .pipe(gulp.dest('dist/js'))
})

// Composer Copy

gulp.task('composerCopy', function() {
  return gulp.src('src/composer/**/*')
  .pipe(gulp.dest('dist/composer'))
})



// Git add

gulp.task('git-add', function(){
  return gulp.src('./*')
    .pipe(gitignore())
    .pipe(git.add({args: '-A',quiet: true}));
});

// Git commit

gulp.task('git-commit', function(){
  return gulp.src('./*')
    .pipe(git.commit(undefined, {
      args: '-m "commit"',
      disableMessageRequirement: true
    }));
});


//Git push

gulp.task('git-push', function(){
  git.push('origin', 'gh-pages', function (err) {
    if (err) throw err;
  });
});


//////////////////////////////////////////////


// BUILD TASK

gulp.task('build', function(callback) {

  runSequence('clean:dist','sass','webPagesCopy','minify-css','strip-js','minimify-js','jqueryCopy','imgCopy','fontsCopy','composerCopy', callback)
  //runSequence('clean:dist','sass','webPagesCopy','minify-css','strip-js','jqueryCopy','imgCopy','fontsCopy', callback)
})


// REPO FOR DEV PHASE

gulp.task('repo', function(callback) {
  runSequence('git-add','git-commit','git-push', callback)
})


// DEFAULT DEV TASK

gulp.task('default', function(callback) {
  runSequence('sass','browserSync', 'watch',
    callback
  );
});
