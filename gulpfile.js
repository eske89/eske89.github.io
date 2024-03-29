const gulp        = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');

const paths = {
  scripts: {
    src: './',
    dest: './build/'
  }
};

// Reload Server
async function reload() {
  server.reload();
}

// Copy assets after build
async function copyAssets() {
  gulp.src(['assets/**/*'])
    .pipe(gulp.dest(paths.scripts.dest));
}

// Build files html and reload server
async function buildAndReload() {
  await includeHTML();
  await copyAssets();
  reload();
}

async function includeHTML(){
  return gulp.src([
    '*.html'
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}
exports.includeHTML = includeHTML;

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.scripts.dest,
      middleware: function(req,res,next) {
        if (req.url === '/artworks') {
          req.url = '/artworks.html';
        } else if (req.url === '/contact') {
          req.url = '/contact.html';
        }
        return next();
      }
    }
  });
  // Build and reload at the first time
  buildAndReload();
  // Watch task
  watch(["*.html", "partials/*.html","assets/**/*"], series(buildAndReload));
};

exports.build = buildAndReload;