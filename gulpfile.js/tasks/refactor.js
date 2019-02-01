const { join } = require("path");
const del = require("del");
const rename = require("gulp-rename");
const env = require("../../tools/enviroment");

function addPackageJsonFile(gulp) {
    const fn = () => gulp.src(join(env.root, 'package.json'))
        .pipe(gulp.dest(env.buildDir));
    fn.displayName = 'addPackageJsonFile';
    return fn;
}

function moveEs5Module(gulp) {
    const fn = () => gulp.src(join(env.buildDir, 'src', '*.js'), { sourcemaps: true })
        .pipe(gulp.dest(join(env.buildDir, 'es5'), { sourcemaps: '.' }));
    fn.displayName = 'moveEs5Module';
    return fn;
}

function renameDeclarationFile(gulp) {
    const fn = () => gulp.src(join(env.buildDir, 'public_api.d.ts'), { base: env.buildDir })
        .pipe(rename({ basename: 'tsst', extname: '.d.ts' }))
        .pipe(gulp.dest(env.buildDir));
    fn.displayName = 'renameDeclarationFile';
    return fn;
}

function cleanUnusefulFile() {
    const fn = () => del([join(env.buildDir, 'public_api.js'), join(env.buildDir, 'src', '*.js')]);
    fn.displayName = 'cleanUnusefulFile';
    return fn;
}

module.exports = (gulp) => gulp.series(gulp.parallel(
    moveEs5Module(gulp)
    , renameDeclarationFile(gulp)
    , addPackageJsonFile(gulp)
), cleanUnusefulFile());
