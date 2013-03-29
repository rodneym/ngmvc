

var fs = require('fs')
  ,	util = require('util')
  ,	assert = require('assert')
  , express = require('express');

exports.mount = (function() {
	return function bindControllers(app, controllerPath) {
		fs.readdirSync(controllerPath).forEach(function(fileName) {
			if(fileName.indexOf(".js") != -1) {
				console.log(util.format("mounting controller: %s", fileName));

				var   module = require(controllerPath + '/' + fileName)
					, controllerClass = module.controller
					, controller = new controllerClass()
				    , root = controller.root || util.format('/%s', module.controller.name.toLowerCase());
					
				
				// all controllers have a default unless it's explicitly disabled
				if (controllerClass.prototype.defaultView === undefined)
					controllerClass.prototype.defaultView = true;

				// default view template set to the controller name
				if (controllerClass.prototype.viewTemplate == undefined)
					controllerClass.prototype.viewTemplate = controllerClass.name;

				// sythesize default if needed
				if (controllerClass.prototype.defaultView) {
					if (controllerClass.prototype['default'] === undefined) {
						// attach a simple view handler
						controllerClass.prototype.default = function(context) {
							context.res.render(controllerClass.prototype.viewTemplate);
						}
					}
  					console.log( util.format("    GET %s -> %s", root, "default"));
	  		    	app.get(root, contextualize(controllerClass, "default", {}));
				}

				// mountable methods must start with "ng_"
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
	    	var mountPoint = root + '/' + parts.shift(); 

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

