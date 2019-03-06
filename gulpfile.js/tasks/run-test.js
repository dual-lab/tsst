const { join } = require("path");
const Jasmine = require("jasmine");
const JasmineSpecRepo = require("jasmine-spec-reporter").SpecReporter;
const del = require("del");
const { resolveModuleCli } = require("../../tools/resolveModuleCli");
const { executeCmd } = require("../cmd-executor");
const { addPackageJsonFile } = require("../move-packagejson");
const env = require("../../tools/enviroment");

function cleanTest() {
    return del([env.buildDirTest]);
}
cleanTest.displayName = "cleanTest";

function transpileForTest() {
    return executeCmd(`${resolveModuleCli('typescript', 'tsc')} -p ${env.tsConfigTest}`);
}
transpileForTest.displayName = "transpileForTest";

function executeJasmine() {
    const engine = new Jasmine();
    const repo = new JasmineSpecRepo();

    engine.addReporter(repo);

    const testSpecs = join(env.buildDirTest, '**', '*_specs.js');

    return new Promise((res, rej) => {
        engine.onComplete((passed) => {
            passed ? res('Test passed') : rej('Test not passed');
        });
        engine.execute([testSpecs]);
    });
}
executeJasmine.displayName = "executeJasmine";

module.exports = (gulp) => gulp.series(cleanTest, transpileForTest, addPackageJsonFile(gulp, env.buildDirTest), executeJasmine);