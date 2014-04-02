/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#pep', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.pep(), this.elems, 'should be chainable');
  });

  test('plugin name', 1, function() {
    var $el = $( '#qunit-fixture span' ).first();
    $el.pep();
    strictEqual($el.data('plugin_pep').name, 'pep', 'plugin name should be Pep');
  });

  test('toggle pep object', 1, function() {
    var $el = $( '#qunit-fixture span' ).first();
    $el.pep();
    $el.data('plugin_pep').toggle()
    strictEqual($el.first().data('plugin_pep').disabled, true, 'this.disable variable should be true when toggled once');
  });

  test('explicit toggle pep object', 1, function() {
    var $el = $( '#qunit-fixture span' ).first();
    $el.pep();
    $el.data('plugin_pep').toggle(false) // false === disable
    strictEqual($el.first().data('plugin_pep').disabled, true, 'this.disable variable should be true when toggled off explicitly');
  });

  test('toggle via api - once', 1, function() {
    var $el = $( '#qunit-fixture span' );
    $el.pep();

    $.pep.toggleAll()
    strictEqual($el.first().data('plugin_pep').disabled, true, 'this.disable variable should be true when toggled once');
  });

  test('toggle via api - twice', 1, function() {
    var $el = $( '#qunit-fixture span' );
    $el.pep();

    $.pep.toggleAll()
    $.pep.toggleAll()
    strictEqual($el.first().data('plugin_pep').disabled, false, 'this.disable variable should be false when toggled twice');
  });

  test('activeDropRegions initially declared', 2, function() {
    var $el = $( '#qunit-fixture span' );
    $el.pep();

    ok($el.data('plugin_pep').activeDropRegions, '`activeDropRegions` property is defined');
    equal($el.data('plugin_pep').activeDropRegions.length, 0, '`activeDropRegions` property is initialized with length 0');
  });

}(jQuery));
