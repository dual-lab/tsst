const log = require("fancy-log");
const { readFileSync } = require("fs");
const { validateCommitHeader } = require("../tools/commit-msg-rules");

((commitFile) => {
    log.info('Checking commit message.....Goog Lucky.....!!!');
    // Read sync commit file and split ultil first new line character.
    try {
        const commit = readFileSync(commitFile, { encoding: 'utf-8' });
        const msgHeader = commit.split("\n")[0];
        validateCommitHeader(msgHeader);
        process.exitCode = 0;
    } catch (err) {
        log.error("Error during validation: ", err.message);
        process.exitCode = 1;
    }

})(process.env["HUSKY_GIT_PARAMS"]);
