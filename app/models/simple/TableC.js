'use strict';

const $ = require('jquery');
const SimpleModel = require('../lib/SimpleModel');

// Misc
let Data = require('./TableC.json');

module.exports = class TableC extends SimpleModel {

  get _validAttribs() { return [
    'c1',
    'c2',
    'total',
    'children'
  ]; }

  initialize() {
    super.initialize();
    // This is done in lieu of an API to hit
    this.fetch();
  }

  fetch() {
    var defer = $.Deferred();
    // This is done in lieu of an API to hit
    this.set(Data);
    defer.resolve();
    return defer.promise;
  }

  save() {
    var defer = $.Deferred();
    // This is done in lieu of an API to hit
    Data = this.toJSON();
    defer.resolve();
    return defer.promise;
  }

};
