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
const https = require('https');
const fs = require('fs');
const path = require('path');

const { version, name, description } = require('../../package.json');
const { extractDescFromChangelog } = require("../../tools/extract-changelog")

const tagName = `v${version}`;
const isPreRel = /^.+-(?:alpha|beta)$/.test(version);
const distToRel = process.argv[2];
const distAssetName = `${name.replace('@', '').replace('/', '-')}-${tagName}.tgz`;
const out = process.stdout;

const authHeader = { 'authorization': `token ${process.env['GITHUB_TOKEN']}`, 'user-agent': 'tsst' };
const commonReqOptions = Object.assign({
    hostname: 'api.github.com'
    , headers:
        Object.assign({}, authHeader)
});

const relBody = {
    tag_name: `${tagName}`,
    target_commitish: 'master',
    name: `${tagName}`,
    body: description,
    draft: false,
    prerelease: isPreRel
};

function checkIfTheRelAlreadyExists() {
    return new Promise((resolve, reject) => {
        https
            .get(
                Object.assign({}, commonReqOptions, { path: `/repos/dual-lab/tsst/releases/tags/${tagName}` }),
                (res) => {
                    res.resume();
                    if (res.statusCode === 200) {
                        reject(`Release for tag ${tagName} already exists`);
                    } else if (res.statusCode !== 404) {
                        reject(`Server response with [${res.statusCode}]: ${res.statusMessage}`);
                    } else {
                        resolve(false);
                    }
                }
            )
            .once('error', (err) => {
                reject(err.message);
            })
            .end()
    });
}

// RETURN upload_url
function creatingTagAndRel() {
    const relBodyJson = JSON.stringify(relBody);
    return new Promise((resolve, reject) => {
        https
            .request(
                Object.assign({}, commonReqOptions, {
                    path: '/repos/dual-lab/tsst/releases',
                    method: 'POST',
                    headers: Object.assign({}, authHeader, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(relBodyJson) })
                }),
                (res) => {
                    // Check response
                    res.setEncoding('utf-8');
                    if (res.statusCode !== 201) {
                        let errorBody = '';
                        res.on('data', (message) => errorBody += message);
                        res.once('end', () => {
                            reject(`Tag release not created: [${res.statusCode}]: ${res.statusMessage}\n Error body: ${errorBody}`);
                        });
                    } else {
                        let resBody = '';
                        res.on('data', (message) => resBody += message);
                        res.once('end', () => {
                            try {
                                const relOutcame = JSON.parse(resBody);
                                if (relOutcame && relOutcame.upload_url) {
                                    resolve(relOutcame.upload_url);
                                } else {
                                    throw new Error('Response body empty or missing "upload_url" field');
                                }
                            } catch (e) {
                                reject(`Failing parsing server response: ${e.message}\n Body: ${resBody}`);
                            }
                        });
                    }
                }
            )
            .once('error', (err) => {
                reject(err.message)
            })
            .end(relBodyJson);
    });
}

function uploadRelAsset(uploadTourl) {
    const uploadUrl = uploadTourl.replace(/\{.+\}$/, `?name=${distAssetName}`);
    const assetContent = fs.readFileSync(path.join(distToRel, distAssetName));
    return new Promise((resolve, reject) => {
        https.request(
            uploadUrl,
            Object.assign({}, {
                method: 'POST',
                headers: Object.assign({}, authHeader, { 'content-type': 'application/gzip', 'content-length': Buffer.byteLength(assetContent) })
            })
            , (res) => {
                // Check response
                res.setEncoding('utf-8');
                if (res.statusCode !== 201) {
                    let errorBody = '';
                    res.on('data', (message) => errorBody += message);
                    res.once('end', () => {
                        reject(`Asset not uploaded: [${res.statusCode}]: ${res.statusMessage}\n Error body: ${errorBody}`);
                    });
                } else {
                    res.resume();
                    resolve(0);
                }
            }
        )
            .once('error', (err) => {
                reject(err.message)
            })
            .end(assetContent);
    });
}

(async () => {
    out.write(`Publish tag ${tagName} is pre-rel: ${isPreRel}\n`);

    try {
        await checkIfTheRelAlreadyExists();
        const changelogExtract = await extractDescFromChangelog('./CHANGELOG.md', tagName);
        relBody.body = `${changelogExtract} \n _${description}_.`;
        out.write('Tag not exist...crating one\n');
        const uploadUrl = await creatingTagAndRel();
        out.write(`Upload asset  ${path.join(distToRel, distAssetName)}\n to ${uploadUrl}.\n`);
        const uploadStatus = await uploadRelAsset(uploadUrl);
        return uploadStatus;
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
        out.write(`Error on publish process: ${err}\n`);
        process.exitCode = 1;
    });