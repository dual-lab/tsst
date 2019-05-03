const readline = require("readline");
const fs = require("fs");

function once(emitter, event) {
    return new Promise((resolve) => {
        emitter.once(event, () => resolve(true));
    });
}

/**
 * Extract small description from changelog file
 * in keepchangelog format.
 * @param {string} changelog 
 * @param {string} versionTag 
 */
async function extractDescriptionFromChangelog(changelog, versionTag) {
    const changelogStream = fs.createReadStream(changelog);
    const rl = readline.createInterface({
        input: changelogStream,
        crlfDelay: Infinity
    });

    const startTag = new RegExp(`^## \\[${versionTag}\\]`);
    const endTag = /^##[^#]/;
    let startBuffering = false;
    let closed = false;
    let description = '';

    rl.on('line', (line) => {
        if (closed) return;

        if (startBuffering) {
            if (endTag.test(line)) {
                startBuffering = false;
                closed = true;
                rl.close();
            } else {
                description += `${line}\n`;
            }
        } else if (startTag.test(line)) {
            startBuffering = true;
        }
    });

    await once(rl, 'close');
    changelogStream.destroy();
    return description;
}

exports.extractDescFromChangelog = extractDescriptionFromChangelog;

