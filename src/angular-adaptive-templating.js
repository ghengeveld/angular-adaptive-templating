(function () {
  'use strict';

  angular.module('adaptiveTemplating', [])
    .provider('adaptiveTemplating', function() {
      var self = this;
      var tests = angular.extend({}, window.Modernizr);

      /**
       * Register a new test, or replace an existing one.
       *
       * @param {string} name The name by which determines the pattern.
       * @param {boolean|function} test The actual test, as boolean or function.
       * @returns {this} Reference to this, to enable method chaining.
       */
      this.addTest = function (name, test) {
        tests[name] = test;
        return this;
      };

      /**
       * Remove a registered test from the list of tests.
       *
       * @param {string} name The name of the test.
       * @returns {this} Reference to this, to enable method chaining.
       */
      this.removeTest = function (name) {
        delete tests[name];
        return this;
      };

      /**
       * Retrieve all registered tests.
       *
       * @returns {Object} Hash of all tests.
       */
      this.getTests = function () {
        return angular.copy(tests);
      };

      /**
       * Regular expression by which to match test patterns. Override it if necessary.
       * The default pattern matches strings like {testname}.
       */
      this.patternRegExp = /{([^{}]+?)}/gi;

      /**
       * Reformats the final URL. Override it if necessary.
       * The default implementation removes superfluous slashes and dots.
       *
       * @param {string} url The original URL.
       * @returns {string} The reformatted URL.
       */
      this.normalizeUrl = (function () {
        var slashDot = /\/\.+/g;
        var dotSlash = /\.+\//g;
        var consecutiveSlashesAndDots = /([^:])(\/|\.)\2+/g;
        return function (url) {
          return url
            .replace(slashDot, '/')
            .replace(dotSlash, '/')
            .replace(consecutiveSlashesAndDots, '$1$2');
        };
      })();

      /**
       * Callback to rewrite the URL when a test succeeds. Override it to suit your needs.
       *
       * @param {string} url The current URL.
       * @param {string} match The matching test pattern.
       * @param {string} testname The name of the test.
       * @returns {string} The new URL.
       */
      this.whenTrue = function (url, match, testname) {
        return url.replace(match, testname);
      };

      /**
       * Callback to rewrite the URL when a test fails. Override it to suit your needs.
       *
       * @param {string} url The current URL.
       * @param {string} match The matching test pattern.
       * @param {string} testname The name of the test.
       * @returns {string} The new URL.
       */
      this.whenFalse = function (url, match/*, testname*/) {
        return url.replace(match, '');
      };

      /**
       * Takes a URL containing test patterns and rewrites it according to the test results.
       *
       * @param {string} templateUrl The original URL.
       * @returns {string} The rewritten URL.
       */
      this.rewriteUrl = function (templateUrl) {
        var patternMatches = templateUrl.match(self.patternRegExp);
        if (patternMatches) {
          patternMatches.forEach(function (match) {
            var testname = match.replace(self.patternRegExp, '$1');
            var test = tests[testname];
            if (typeof test === 'function' && test() || typeof test === 'boolean' && test) {
              templateUrl = self.whenTrue(templateUrl, match, testname);
            } else {
              templateUrl = self.whenFalse(templateUrl, match, testname);
            }
          });
        }
        return self.normalizeUrl(templateUrl);
      };

      /**
       * Factory function for the service. Allows adding/removing tests at runtime.
       *
       * @returns {{addTest: this, removeTest: this}}
       */
      this.$get = function () {
        return {
          addTest: this.addTest,
          removeTest: this.removeTest
        };
      };
    })

    .config(['$provide', 'adaptiveTemplatingProvider', function ($provide, adaptiveTemplatingProvider) {
      /**
       * Decorates the $http.get method, rewriting the request URL to enable adaptive templating.
       */
      $provide.decorator('$http', function($delegate) {
        var getFn = $delegate.get;
        $delegate.get = function () {
          arguments[0] = adaptiveTemplatingProvider.rewriteUrl(arguments[0]);
          return getFn.apply(this, arguments);
        };
        return $delegate;
      });
    }]);

})();
