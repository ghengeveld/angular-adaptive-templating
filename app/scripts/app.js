(function () {
  'use strict';

  angular.module('adaptiveTemplating', [])
    .provider('adaptiveTemplating', function() {
      var _tests = angular.extend({}, window.Modernizr);
      var _replacement = '';
      var _prefix = false;

      var normalizePath = (function () {
        var pathSeparatorRegex = /(\/|\.)\1+/g;
        return function (path) {
          return path.replace(pathSeparatorRegex, '$1');
        };
      })();

      var parseTemplatePattern = (function () {
        var patternRegex = /[a-z]+\?/gi;
        return function (templatePattern) {
          var patternMatches = templatePattern.match(patternRegex);
          if (patternMatches) {
            patternMatches.forEach(function (match) {
              var testname = match.slice(0, -1);
              var test = _tests[testname];
              if (typeof test === 'function' && test() || typeof test === 'boolean' && test) {
                templatePattern = templatePattern.replace(match, testname);
              } else {
                templatePattern = _prefix ?
                  templatePattern.replace(match, _replacement + match) :
                  templatePattern.replace(match, _replacement);
              }
            });
          }
          return normalizePath(templatePattern);
        };
      })();

      this.$get = function () {
        return { addTest: this.addTest, removeTest: this.removeTest };
      };

      this.addTest = function (name, test) {
        _tests[name] = test;
        return this;
      };

      this.removeTest = function (name) {
        delete _tests[name];
        return this;
      };

      this.decorate = function ($provide) {
        $provide.decorator('$http', function($delegate) {
          var getFn = $delegate.get;
          $delegate.get = function () {
            arguments[0] = parseTemplatePattern(arguments[0]);
            return getFn.apply(this, arguments);
          };
          return $delegate;
        });
      };

      this.setReplacement = function (replacement, prefix) {
        _replacement = str;
        _prefix = !!prefix;
      };
    })

    .config(function (adaptiveTemplatingProvider, $provide) {
      adaptiveTemplatingProvider.decorate($provide);
    });

  angular.module('angularAdaptiveTemplatingApp', ['ngRoute', 'adaptiveTemplating'])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/desktop?mobile?/main.touch?.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    })

    .run(function (adaptiveTemplating, $window) {
      adaptiveTemplating
        .addTest('desktop', $window.matchMedia('(min-width: 768px)').matches)
        .addTest('mobile', $window.matchMedia('(max-width: 767px)').matches);
    });

})();
