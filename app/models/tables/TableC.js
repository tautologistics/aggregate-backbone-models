'use strict';

// Libs
let $ = require('jquery');
let SuperModel = require('backbone.supermodel');

// Models
let AppState = require('../AppState');

// Misc
let Emitter = AppState.getTablemodelEmitter('TableC');
let Data = require('./TableC.json');

module.exports = SuperModel.extend({

  initialize: function () {
    // Pipe all events to AppState
    this.listenTo(this, 'all', Emitter);
    // This is done in lieu of an API to hit
    this.set(Data);
  },

  fetch: function () {
    var defer = $.Deferred();
    // This is done in lieu of an API to hit
    this.set(Data);
    defer.resolve();
    return defer.promise;
  },

  save: function () {
    var defer = $.Deferred();
    // This is done in lieu of an API to hit
    Data = JSON.parse(JSON.stringify(this.attributes));
    defer.resolve();
    return defer.promise;
  },

});
