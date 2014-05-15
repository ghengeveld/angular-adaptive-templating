# Angular Adaptive Templating

Load different templates based on device capability.

## Installation

Simply install using Bower:

    bower install --save angular-adaptive-templating

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

## Provider API

These are available in your module's config block.

### {function} addTest({string} name, {boolean|function} test)
Register a new test, or replace an existing one.

    @param {string} name The name by which determines the pattern.
    @param {boolean|function} test The actual test, as boolean or function.
    @returns {this} Reference to this, to enable method chaining.

### {function} removeTest({string} name)
Remove a registered test from the list of tests.

    @param {string} name The name of the test.
    @returns {this} Reference to this, to enable method chaining.

### {function} getTests()
Retrieve all registered tests.

    @returns {Object} Hash of all tests.

### {RegExp} patternRegExp
Regular expression by which to match test patterns. Override it if necessary.
The default pattern matches strings like {testname}.

### {function} normalizeUrl({string} url)
Reformats the final URL. Override it if necessary.
The default implementation removes superfluous slashes and dots.

    @param {string} url The original URL.
    @returns {string} The reformatted URL.

### {function} whenTrue({string} url, {string} match, {string} testname)
Callback to rewrite the URL when a test succeeds. Override it to suit your needs.

    @param {string} url The current URL.
    @param {string} match The matching test pattern.
    @param {string} testname The name of the test.
    @returns {string} The new URL.

### {function} whenFalse({string} url, {string} match, {string} testname)
Callback to rewrite the URL when a test fails. Override it to suit your needs.

    @param {string} url The current URL.
    @param {string} match The matching test pattern.
    @param {string} testname The name of the test.
    @returns {string} The new URL.

### {function} rewriteUrl({string} templateUrl)
Takes a URL containing test patterns and rewrites it according to the test results.

    @param {string} templateUrl The original URL.
    @returns {string} The rewritten URL.

