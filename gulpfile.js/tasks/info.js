const log = require("fancy-log");

module.exports = () => async () => {
    const { name, version, repository: { url }, bugs, licence, description } = require("../../package.json");
    const infoText =
        `
   >*******************<

   ${name}
   ட version: ${version}
   ட description: ${description}
   ட repo:    ${url}
   ட licence: ${licence}
   ட bugs:    ${bugs.url}

   >*******************<`;

    log.info(infoText);
};
