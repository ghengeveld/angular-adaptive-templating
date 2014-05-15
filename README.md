# Angular Adaptive Templating

Load different templates based on device capability.

## Usage

### 1. Configure 'adaptiveTemplating' as a dependency

Add it between the brackets:

    angular.module('myApp', ['adaptiveTemplating']);

### 2. Configure some tests

Tests can be configured in your module's config block:

    myApp.config(function (adaptiveTemplatingProvider) {
      var isMobile = $window.matchMedia('(max-width: 767px)').matches;
      adaptiveTemplatingProvider.addTest('mobile', isMobile);
    })

Or at runtime:

    myApp.run(function (adaptiveTemplating, $window) {
      var isMobile = $window.matchMedia('(max-width: 767px)').matches;
      adaptiveTemplating.addTest('mobile', isMobile);
    });

Note that all tests defined by Modernizr are included by default, provided that
Modernizr is available.

### 3. Update your templateUrls

It works with routes:

    myApp.config(function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'views/{mobile}/index.html'
      });
    })

Or in directives:

    myApp.directive('myDirective', function() {
      return {
        templateUrl: 'my-directive/{mobile}/main.html'
      };
    });

Or with ngInclude:

    <div ng-include="'partials/{mobile}/something.html'"></div>
