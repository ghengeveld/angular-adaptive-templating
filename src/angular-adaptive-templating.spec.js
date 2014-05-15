'use strict';

describe('adaptiveTemplatingProvider', function () {

  var atp;

  beforeEach(function () {
    // Initialize the service provider by injecting it to a fake module's config block
    angular.module('testApp', function () {}).config(function (adaptiveTemplatingProvider) {
      atp = adaptiveTemplatingProvider;
    });

    // Initialize actual app injector
    module('adaptiveTemplating', 'testApp');

    // Kickstart the injectors previously registered with calls to angular.mock.module
    inject();
  });

  it('has an addTest method', function () {
    expect(typeof atp.addTest).toBe('function');
  });

  it('has a removeTest method', function () {
    expect(typeof atp.removeTest).toBe('function');
  });

  it('has a getTests method', function () {
    expect(typeof atp.getTests).toBe('function');
  });

  it('has a patternRegExp property', function () {
    expect(atp.patternRegExp instanceof RegExp).toBeTruthy();
  });

  it('has a normalizeUrl method', function () {
    expect(typeof atp.normalizeUrl).toBe('function');
  });

  it('has a whenTrue method', function () {
    expect(typeof atp.whenTrue).toBe('function');
  });

  it('has a whenFalse method', function () {
    expect(typeof atp.whenFalse).toBe('function');
  });

  it('has a rewriteUrl method', function () {
    expect(typeof atp.rewriteUrl).toBe('function');
  });

  it('has a $get method', function () {
    expect(typeof atp.$get).toBe('function');
  });

  describe('#addTest', function () {
    it('registers a test', function () {
      expect(atp.getTests().foo).toBeUndefined();
      atp.addTest('foo', true);
      expect(atp.getTests().foo).toBeDefined();
    });
  });

  describe('#removeTest', function () {
    it('unregisters a test', function () {
      atp.addTest('bar', true);
      expect(atp.getTests().bar).toBeDefined();
      atp.removeTest('bar');
      expect(atp.getTests().bar).toBeUndefined();
    });
  });

  describe('#getTests', function () {
    it('lists all registered tests', function () {
      atp.addTest('foo', true);
      atp.addTest('bar', false);
      atp.addTest('baz', angular.noop);
      expect(atp.getTests()).toEqual({
        foo: true,
        bar: false,
        baz: angular.noop
      });
    });
  });

  describe('#normalizeUrl', function () {
    it('removes consecutive slashes and dots', function () {
      var result = atp.normalizeUrl('a/b//c///d.e..f...g');
      expect(result).toBe('a/b/c/d.e.f.g')
    });

    it('prefers slashes over dots', function () {
      var result = atp.normalizeUrl('a/.b/..c./d../e//.f//..g');
      expect(result).toBe('a/b/c/d/e/f/g')
    });

    it('ignores the protocol part', function () {
      var result = atp.normalizeUrl('foo://bar.baz');
      expect(result).toBe('foo://bar.baz')
    });
  });

  describe('#whenTrue', function () {
    it('replaces the pattern with the test name', function () {
      var result = atp.whenTrue('foo.{bar}.baz', '{bar}', 'bar');
      expect(result).toBe('foo.bar.baz')
    });
  });

  describe('#whenFalse', function () {
    it('removes the pattern', function () {
      var result = atp.whenFalse('foo.{bar}.baz', '{bar}', 'bar');
      expect(result).toBe('foo..baz')
    });
  });

  describe('#rewriteUrl', function () {
    it('parses the entire URL using the registered tests', function () {
      atp.addTest('bar', false);
      atp.addTest('baz', true);
      var result = atp.rewriteUrl('foo/{bar}/{baz}.html');
      expect(result).toBe('foo/baz.html')
    });

    it('treats missing tests as falsy', function () {
      atp.addTest('baz', true);
      var result = atp.rewriteUrl('foo/{bar}/{baz}.html');
      expect(result).toBe('foo/baz.html')
    });

    it('allows tests to be functions', function () {
      atp.addTest('bar', function () { return false; });
      atp.addTest('baz', function () { return true; });
      var result = atp.rewriteUrl('foo/{bar}/{baz}.html');
      expect(result).toBe('foo/baz.html')
    });

    it('calls whenTrue when a test succeeds', function () {
      spyOn(atp, 'whenTrue').andCallThrough();
      atp.addTest('bar', true);
      atp.rewriteUrl('foo.{bar}.html');
      expect(atp.whenTrue).toHaveBeenCalledWith('foo.{bar}.html', '{bar}', 'bar');
    });

    it('calls whenFalse when a test fails', function () {
      spyOn(atp, 'whenFalse').andCallThrough();
      atp.addTest('bar', false);
      atp.rewriteUrl('foo.{bar}.html');
      expect(atp.whenFalse).toHaveBeenCalledWith('foo.{bar}.html', '{bar}', 'bar');
    });

    it('normalized the URL', function () {
      spyOn(atp, 'normalizeUrl');
      atp.rewriteUrl('foo.html');
      expect(atp.normalizeUrl).toHaveBeenCalledWith('foo.html');
    });
  });

});
