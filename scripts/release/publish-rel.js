/**
 * Node js script that publish to git
 * the release tag with asset.
 * 
 * 1. check existence of the tag
 * 2. <>
 *  T. skip step
 *  F. create tag release
 * 3. upload asset to release 
 */
const https = require("https");
const { version } = require("../../package.json");
const isPreRel = /^.+-(?:alpha|beta)$/.test(version);
const out = process.stdout;

const authHeader = { 'authorization': `token ${process.env['GITHUB_TOKEN']}`, 'user-agent': 'tsst' };
const commonReqOptions = Object.assign({
    hostname: 'api.github.com'
    , headers:
        Object.assign({}, authHeader)
});

function checkIfTheRelAlreadyExists() {
    return new Promise((resolve, reject) => {
        https.get(
            Object.assign({}, commonReqOptions, { path: `/repos/dual-lab/tsst/releases/tags/${version}` }),
            (res) => {
                if (res.statusCode === 200) {
                    reject(`Release for tag v${version} already exists`);
                } else if (res.statusCode !== 404) {
                    reject(`Server response with [${res.statusCode}]: ${res.statusMessage}`);
                } else {
                    resolve(true);
                }
            }
        ).once("error", (err) => {
            reject(err.message);
        }).end()
    });
}

// TODO(dmike16)
// METHOD: POST
// PATH: /repos/:owner/:repo/releases
// HEADER: content-type: application/json, content-length: LEN(JSON)
// RETURN upload_url
function creatingTagAndRel(){}

// TODO(dmike16)
function uploadRelAsset(){}

(async () => {
    out.write(`Publish tag v${version} is pre-rel: ${isPreRel}\n`);

    try {
        const tagNotExists = await checkIfTheRelAlreadyExists();
        if (tagNotExists) {
            out.write(`TODO: Creating tag.\n`);
            return 0;
        }
    } catch (e) {
        throw e;
    }
})()
    .then(
        (resCode) => {
            out.write(`Publish process terminated with success.\n`);
            process.exitCode = resCode;
        }
    ).catch((err) => {
        out.write(`Error on publish process: ${err.message}\n`);
        process.exitCode = 1;
    })