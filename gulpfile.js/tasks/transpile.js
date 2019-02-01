const { resolveModuleCli } = require("../../tools/resolveModuleCli");
const log = require("fancy-log");
const env = require("../../tools/enviroment");
const exec = require("../../gulpfile.js/cmd-executor").executeCmd;

module.exports = () => async () => {
    log.info("Transpiling project with configuration: [", env.tsConfigBuild, "]");
    const cmd = `${resolveModuleCli('typescript', 'tsc')} -p ${env.tsConfigBuild}`;
    await exec(cmd);
};
