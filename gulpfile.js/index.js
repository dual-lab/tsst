const gulp = require("gulp");
const OnDemandRegistry = require("./on-demand-registry");

gulp.registry(new OnDemandRegistry({tasksLocation: './tasks'}));

exports.default = gulp.series('info');
exports.build = gulp.series('clean', 'transpile');
exports.test = gulp.series('build', 'run-test');
exports.prePublish = gulp.series('build', 'lint', 'refactor');