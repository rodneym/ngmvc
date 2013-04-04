

var fs = require('fs')
  ,	util = require('util')
  ,	assert = require('assert')
  , express = require('express')
  , path = require('path');

exports.mount = (function() {
	return function bindControllers(app, controllerPath) {
		fs.readdirSync(controllerPath).forEach(function(fileName) {
			if(fileName.indexOf(".js") != -1) {
				console.log(util.format("mounting controller: %s", fileName));

				var   module = require(controllerPath + '/' + fileName)
					, controllerClass = module.controller
					, controller = new controllerClass()
				    , root = controller.root || util.format('/%s', module.controller.name.toLowerCase());
					
				
				// all controllers have a default view handler it's explicitly disabled
				controllerClass.prototype.disableViews = controllerClass.prototype.disableViews || false;

				// default template path to contoller name unless explicity set 
				controllerClass.prototype.viewTemplatePath = controllerClass.prototype.viewTemplatePath || controllerClass.name;

				// synthesize an angular view handler if needed
				if (!controllerClass.prototype.disableViews) {
					if (controllerClass.prototype['ngView'] === undefined) {
						// define the default angular view handler
						// and bind as controllerClass/ngview/:template
						controllerClass.prototype.ngView = function(context) {
							var template = context.req.params.template;
							var template = path.join(controllerClass.prototype.viewTemplatePath, template);
							console.log('VIEWING -> ' + template);
							context.res.render(template);
						}
					}
					var templateMount = path.join(root, "ngview", ":template");
  					console.log( util.format("    GET %s -> %s", templateMount, "viewHandler"));
	  		    	app.get(templateMount, contextualize(controllerClass, "ngView", {}));
				}

				// synthesize a "default" handler if one is not declared
				if (controllerClass.prototype['default'] === undefined) {
					controllerClass.prototype.default = function(context) {
						console.log('SYNTHETIC default');
						var template = path.join(controllerClass.prototype.viewTemplatePath, "default");
						context.res.render(template);
					}

					console.log(util.format("    GET %s -> %s", root, "default"));
					app.get(root, contextualize(controllerClass, "default", {}));
				}

				// mountable all methods must start with "ng_"
      			for(var handler in controller) {
      				if ((typeof(controller[handler])== "function") && (handler.substr(0,3) == "ng_"))
      					mount(controllerClass, root, handler);
      			}
			}
		});


	    function mount(controllerClass, root, handler) {
	    	var   parts = handler.split('_')
	    		, method = 'get' // implicit get

	    	// handler must start with "ng_"
	    	assert.ok( parts.shift() == 'ng');

	    	// explicit method - ng_[method]_handler
	    	if ( ['get', 'put', 'post', 'del'].indexOf(parts[0].toLowerCase()) != -1)
	    		method = parts.shift().toLowerCase();

    		// handler name
	    	var mountPoint = root;
	    	var namedParams = {};
	    	while (part = parts.shift()){
	    		// is param?
	    		if (part.substr(0,1) == '$') {
	    			p = part.substr(1);
	    			namedParams.p = null;
	    			part = ":" + p;
				}
	    		mountPoint = path.join(mountPoint, part);
	    	}


	    	console.log( util.format("    %s %s -> %s", method.toUpperCase(), mountPoint, handler));
	    	app[method](mountPoint, contextualize(controllerClass, handler, {}));
	    }

	    
	    function contextualize(controllerClass, handler, context) {
	    	return function (req, res, next) {
	    		
	    		var   instance = new controllerClass()
	    			, method = instance[handler];

	    		context.req = req;
	    		context.res = res;
	    		context.next = next;
	    		
	    		method.apply(instance, [context]);
	    	}
	    }

	}
})();

