var fs     = require('fs'),
Handlebars = require('handlebars'),
Assets     = require('./Assets'),
sass       = require('node-sass');

var Router = function() {
	this.routes = ['/'];
};

Router.prototype.map = function() {
	var _this = this;
	
	[].forEach.call(arguments, function (el) {
		_this.routes.push(el);
	});
};

Router.prototype.validRoute = function(route) {
	var res = false;
	route = route == "" ? "/" : route;
	this.routes.forEach(function(element, index) {
		if (element == route) {
			res = true;
		}
	});

	return res;
};

Router.prototype.manage = function(req, res) {
	var method = req.method;
	var urlRequested = req.url;
	var assets = new Assets(res);
	var path = '';

	if (assets.check(urlRequested)) {
		assets.getPath();

		if (assets.isCSS()) {
			assets.compileSASS();
		}
		else {
			assets.readImage();
		}
	}
	else {
		var questionMark = urlRequested.indexOf("?");

		if (questionMark != -1) {
			var parameters = urlRequested.slice(questionMark + 1, urlRequested.length);
			urlRequested = urlRequested.slice(0, questionMark);
		}
		
		var validRoute = this.validRoute(urlRequested);

		if (!validRoute) {
			path += "app/views/global/404.html";
			fs.readFile(path, function(err, data) {
				if (err) { console.log(clc.red("ERROR LOADING FILE WITH " + _this.url + " URL")); }
		    	res.end(data);
			});
		}
		else {
			var controllerPath = "../app/controllers";
			controllerPath +=  urlRequested.length > 1 ? urlRequested : "/index";
			controllerPath += ".js";

			var Controller = require(controllerPath);
			var controller = new Controller(req, parameters);

			path += "app/views/";
			path += urlRequested.length > 1 ? urlRequested : "index";
			path += ".hbs";


			controller.execute(function(data) {
				var template = fs.readFileSync(path, "utf8");
        var pageBuilder = Handlebars.compile(template);
        var pageText = pageBuilder(data);
        res.writeHead(200, {"Context-Type": "text/html"});
        res.write(pageText);
        res.end();
			});

		}
	}
};

module.exports = Router;