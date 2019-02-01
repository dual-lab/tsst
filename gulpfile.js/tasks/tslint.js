const { resolveModuleCli } = require("../../tools/resolveModuleCli");
const env = require("../../tools/enviroment");
const exec = require("../../gulpfile.js/cmd-executor").executeCmd; 
const log = require("fancy-log");

module.exports = () => async () => {
    log.info('Linting project with tslint: [', env.tsLintConfig, ']');
    const cmd = `${resolveModuleCli('tslint', 'tslint')} -c ${env.tsLintConfig} -p ${env.tsConfigBuild}`;
    await exec(cmd);
};
