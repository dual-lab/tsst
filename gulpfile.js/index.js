const gulp = require("gulp");
const OnDemandRegistry = require("./on-demand-registry");

gulp.registry(new OnDemandRegistry({tasksLocation: './tasks'}));

exports.default = gulp.series('info');
exports.build = gulp.series('clean', 'transpile');
exports.lint = gulp.series('clean', 'transpile', 'tslint');
exports.test = gulp.series('build', 'run-test');
exports.prePublish = gulp.series('lint', 'refactor');