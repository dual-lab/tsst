const { exec } = require("child_process");
const log = require("fancy-log");
const { resolveModuleCli } = require("../../tools/resolveModuleCli");
const env = require("../../tools/enviroment");

module.exports = () => () => {
    log.info('Linting project with tslint: [', env.tsLintConfig, ']');
    return new Promise((resolve, reject) => {
        exec(`${resolveModuleCli('tslint', 'tslint')} -c ${env.tsLintConfig} -p ${env.tsConfigBuild}`, (error, stdout, stderr) => {
            if (error) {
                log.error(stdout || stderr);
                reject(error);
            } else {
                log.info('Lint ended', stdout);
                resolve(0);
            }
        });
    });
};
