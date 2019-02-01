const path = require("path");

module.exports = {
    root: path.resolve(__dirname, '..'),
    get buildDir() { return path.join(this.root, 'dist'); },
    get sourceDir() { return path.join(this.root, 'src'); },
    get tsConfigBuild() { return path.join(this.root, 'tsconfig-build.json'); },
    get tsLintConfig() { return path.join(this.root, 'tslint.json'); },
    get lintOutput() { return path.join(this.root, 'tslint-out.txt'); },
    get tsConfigTest() { return path.join(this.root, 'tsconfig-test.json'); },
    get buildDirTest() { return path.join(this.root, 'dist-test'); }
};
