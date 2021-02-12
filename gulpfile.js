const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-cssmin');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
// const cwebp = require('gulp-cwebp');
const browserSync = require('browser-sync').create();

const srcPath   = "./src/";
const distPath  = "./dist/";


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });    

    gulp.watch(srcPath + 'scss/**/*.scss', ['sass']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

// sass
gulp.task('sass', function () {
    return gulp.src(srcPath + 'scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest(srcPath + 'css/'))
        .pipe(browserSync.stream());
    ;
});

// sass watch
gulp.task('sass:watch', function () {
    gulp.watch(srcPath + 'scss/**/*.scss', ['sass']);
});

// deploy tasks
gulp.task('Deploy', ['DeployCss', 'DeployCssmin', 'DeployJs', 'DeployImages', 'deployHtml']);

// css
gulp.task('DeployCss', function () {
    return gulp.src(srcPath+ 'css/**/*.css')
        .pipe(gulp.dest(distPath + 'css/'))
        ;
});
gulp.task('DeployCssmin', function () {
    return gulp.src(srcPath+ 'css/**/*.css')
        .pipe(cssmin())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(distPath + 'css/'))
        ;
});

// scripts
var jsFiles = [
    // srcPath+ "scripts/vendors/modernizr.js",
    srcPath+ "scripts/vendors/swiper.min.js",
    // srcPath+ "scripts/vendors/TweenMax.min.js",
    // srcPath+ "scripts/app.js"
];

gulp.task('DeployJs', function () {
    return gulp.src(jsFiles)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(distPath+'scripts/'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distPath+'scripts/'))
        ;
});

// images
gulp.task('DeployImages', function () {
    // return gulp.src([srcPath+ 'images/**/*', '!svg-icons.svg'])
    return gulp.src(srcPath+ 'images/**/*')
        //.pipe(imagemin())
        .pipe(gulp.dest(distPath + 'images/'))
        ;
});

/// html
gulp.task('deployHtml', function() {
    return gulp.src('./*.html')

    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        // preserveLineBreaks: true
    }))
    .pipe(replace('"src/', '"./'))
    .pipe(replace('"/src/', '"./'))
    .pipe(replace('.css"', '.min.css"'))
    .pipe(replace('<script src="./scripts/vendors/swiper.min.js"></script>', '<script src="./scripts/app.min.js"></script>"'))


    .pipe(gulp.dest(distPath));
});

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(srcPath+'scripts/app.js')
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

// // babel
// gulp.task('babel', () =>
// gulp.src(srcPath+'scripts/app.js')
//     .pipe(babel({
//         presets: ['env']
//     }))
//     .pipe(gulp.dest(distPath))
// );

// // browserify
// gulp.task('browserify', function() {
//     // Single entry point to browserify
//     gulp.src(srcPath+'scripts/app.js')
//         .pipe(browserify({
//           insertGlobals : true,
//           debug : !gulp.env.production
//         }))
//         .pipe(gulp.dest(distPath))
//  });


//  var webpackFiles = [
//     // srcPath+'scripts/vendors/modernizr.js',
//     srcPath+'scripts/vendors/swiper.js',
//     srcPath+'scripts/app.js',
//  ];
//  // webpack
// gulp.task('webpack', function() {
//     return gulp.src(webpackFiles)
//     .pipe(webpack({
//         watch: true,
//         module: {
//             loaders: [
//                 // 'babel-loader',
//                 //{ test: /\.css$/, loader: 'style!css' },
//             ],
//         },
//         output: {
//             filename: 'bundle.js',
//             }
//     }))
//     .pipe(gulp.dest(distPath))
// });

// // Basic configuration example
// config = {
//     mode: {
//         css: {		// Activate the «css» mode
//             render: {
//                 css: true	// Activate CSS output (with default options)
//             }
//         }
//     }
// };

// gulp.task('svgSprite', function () {
//     gulp.src(srcPath + '**/*.svg', {cwd: 'path/to/assets'})
//         .pipe(svgSprite(config))
//         .pipe(gulp.dest('out'));
// });

// // convert any image to webp image
// gulp.task('cwebp', function () {
//     gulp.src(srcPath+'images/to-webp/*')
//       .pipe(gulp.dest(srcPath + 'images/'))
//       .pipe(cwebp())
//       .pipe(gulp.dest(srcPath + 'images/'));
// });

// const environments = require('gulp-environments');
// const browserify = require('gulp-browserify');

// var development = environments.development;
// var production = environments.production;
// var source = production() ? "source.min.js" : "source.js";


// gulp.task('scripts', function() {
//     // Single entry point to browserify
//     gulp.src(srcPath + 'scripts/app.js')
//     .pipe(browserify({
//         insertGlobals : true,
//         // debug : !gulp.env.production
//     }))
//     .pipe(gulp.dest(distPath + './scripts'))
// });

// gulp.src(paths.js)
//   // this will only init sourcemaps in development
//   .pipe(development(sourcemaps.init()))
//   .pipe(concat("app.js"))
//   // only write out sourcemaps in development
//   .pipe(development(sourcemaps.write('.')))
//   // only minify the compiled JS in production mode
//   .pipe(production(uglify()))
//   .pipe(gulp.dest("./public/app/js/"));
