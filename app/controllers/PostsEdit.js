var controller = require('../../lib/smart').Controller;

module.exports = controller.extend(function(req, res) {
	console.log(req.params);
});