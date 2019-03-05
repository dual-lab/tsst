const env = require("../tools/enviroment");
const { join } = require("path");

function addPackageJsonFile(gulp, dest) {
    const fn = () => gulp.src(join(env.root, 'package.json'))
        .pipe(gulp.dest(dest));
    fn.displayName = 'addPackageJsonFile';
    return fn;
}

exports.addPackageJsonFile = addPackageJsonFile;