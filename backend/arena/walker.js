
var fs = require('fs');

/**
 * Directories walker (load all files in a given directory)
 */
exports.walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file,
			stat = fs.statSync(newPath);

		if (stat.isFile() && /(.*)\.(js|coffee)/.test(file)) {
			require(newPath);
		} else if (stat.isDirectory()) {
			walk(newPath);
		}
	});
};
