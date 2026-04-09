const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
// const sass = require("gulp-sass")(require('node-sass'));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
// const autoprefixer = require("autoprefixer");

const paths = {
  scss: "./staticresources/scss/styles.scss",
  brandCss: "./staticresources/scss/brandColors.css",
  watch: "./staticresources/scss/**/*.{scss,css}",
  
  output: {
	"dddev": "./../dealDash-dev/force-app/main/default/staticresources/DealDashAssets/css",
  },
};

// main compiler task
function compileSass(inputFile, outputDir) {
  const plugins = [
    // autoprefixer(),
    // cssnano()
  ];
  return src(inputFile)
    .pipe(sass({ outputStyle: "compressed", quietDeps: true,
    silenceDeprecations: ['legacy-js-api'] }).on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest(outputDir));
}

function copyBrandCss(outputDir) {
  return src(paths.brandCss)
    .pipe(dest(outputDir));
}

//portal scss task
function createSassTask(env) {
  return function sassTask() {
    return compileSass(paths.scss, paths.output[env]);
  };
}

function createBrandCssTask(env) {
  return function brandCssTask() {
    return copyBrandCss(paths.output[env]);
  };
}

// watch tasks functions
function createWatchTask(env) {
  return function watchFiles() {
    watch(paths.watch, createSassTask(env));
    watch(paths.brandCss, createBrandCssTask(env));
  };
}


// Sass
//exports.ptl_poc = series(createSassTask("poc"), createWatchTask("poc"));
//exports.ptl_dev = series(createSassTask("dev"), createWatchTask("dev"));
//exports.ptl_dcdev = series(createSassTask("dcdev"), createWatchTask("dcdev"));
exports.ptl_dddev = series(createSassTask("dddev"), createBrandCssTask("dddev"), createWatchTask("dddev"));