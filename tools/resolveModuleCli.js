const { dirname, sep, join } = require("path");
const log = require("fancy-log");

function resolveMCli(moduleName /**moduel name*/, cliName /**name of cli to resolve or null */) {
    let modulePath = null;
    try {
        modulePath = dirname(require.resolve(moduleName));
    } catch (err) {
        log.warn("Module",moduleName, "not found");
        return '';
    }
    const part = modulePath.split(sep);
    let idx = part.length;
    const backPath = [modulePath];
    while (--idx > 0 && part[idx] !== moduleName) {
        backPath.push('..');
    }
    modulePath = join(...backPath);
    const { bin } = require(`${modulePath}/package.json`);
    const cli = typeof bin === "string" || !cliName ? bin : bin[cliName]; 
    return join(modulePath, cli);
}

exports.resolveModuleCli = resolveMCli;
