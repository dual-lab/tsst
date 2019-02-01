const { exec } = require("child_process");
const log = require("fancy-log");

exports.executeCmd = async function (cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                log.error(stdout || stderr);
                reject(error);
            } else {
                log.info('Execute ended', stdout);
                resolve(0);
            }
        });
    });
}
