const { resolveModuleCli } = require("../../tools/resolveModuleCli");
const { exec } = require("child_process");
const log = require("fancy-log");
const env = require("../../tools/enviroment");

module.exports = () => () => {
    log.info("Transpiling project with configuration: [", env.tsConfigBuild, "]")
    return new Promise((resolve, reject) => {
        exec(`${resolveModuleCli('typescript', 'tsc')} -p ${env.tsConfigBuild}`, (error, stdout, stderr) => {
            if (error) {
                log.error(stdout || stderr);
                reject(error);
            } else {
                log.info('Transpile ended', stdout);
                resolve(0);
            }
        });
    });
}
