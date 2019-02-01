const del = require("del");
const log = require("fancy-log");
const env = require("../../tools/enviroment");

module.exports = () => async () => {
    log.info("Cleaning project output diretory [", env.buildDir, "]");
    return del([env.buildDir])
};
