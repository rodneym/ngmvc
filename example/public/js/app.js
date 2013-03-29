 
'use strict';
 
define(
  'app'
  ,[
    'js/lib/angularjs/angular.js'
  ]
  ,function() {
    var angularModule = angular.module('myapp', []);

    var app = {
      init: function init() {
        //using global angular var
        angular.bootstrap(document, ['myapp']);
      }
    }
 
    app.__defineGetter__('myapp', function() {return angularModule;})
 
    return app;
  }
);