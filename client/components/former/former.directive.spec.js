'use strict';

describe('Directive: former', function () {

  // load the directive's module and view
  beforeEach(module('formerFunApp'));
  beforeEach(module('components/former/former.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<former></former>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the former directive');
  }));
});