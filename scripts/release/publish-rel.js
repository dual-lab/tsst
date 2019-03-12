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
//const https = require("https");
const { version } = require("../../package.json");
const out = process.stdout;

out.write(`Publish tag v${version}\n`);
