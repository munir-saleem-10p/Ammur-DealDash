const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
// const sass = require("gulp-sass")(require('node-sass'));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
// const autoprefixer = require("autoprefixer");

const paths = {
  scss: "./staticresources/scss/styles.scss",
  watch: "./staticresources/scss/**/*.scss",
  
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
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest(outputDir));
}

//portal scss task
function createSassTask(env) {
  return function sassTask() {
    return compileSass(paths.scss, paths.output[env]);
  };
}

// watch tasks functions
function createWatchTask(env, type = "sass") {
  return function watchFiles() {
    let task;

    switch (type) {
      case "sass":
      default:
        task = createSassTask(env);
    }

    watch(paths.watch, task);
  };
}


// Sass
//exports.ptl_poc = series(createSassTask("poc"), createWatchTask("poc"));
//exports.ptl_dev = series(createSassTask("dev"), createWatchTask("dev"));
//exports.ptl_dcdev = series(createSassTask("dcdev"), createWatchTask("dcdev"));
exports.ptl_dddev = series(createSassTask("dddev"), createWatchTask("dddev"));