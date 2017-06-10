'use strict';

// Declare app level module which depends on views, and components
angular.module('wordApp', ["chart.js"
]);

var globalCounter = 0-1;

String.prototype.hashCode = function() {
  globalCounter = globalCounter - 1;
  return globalCounter;
};