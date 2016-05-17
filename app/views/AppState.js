'use strict';

// Libs
let $ = require('jquery');
let Marionette = require('backbone.marionette');

// Models
let AppState = require('../models/lib/AppState');

// Misc
let Template = require('../templates/appState.hbs');

module.exports = Marionette.ItemView.extend({

  id: 'app-state-view',
  template: Template,

  events: {
    'change input': 'updateValue',
    'click .clear': 'clearLogs',
  },

  modelEvents: {
    'change': 'render'
  },

  initialize: function () {
    this.model = AppState;
  },

  clearLogs: function () {
    this.model.get('logs.tablemodel').length = 0;
    this.model.get('logs.aggmodel').length = 0;
    this.render();
  },

  updateValue: function (e) {
    // Binds form field data to model
    let field = $(e.currentTarget);
    let value = field.val();
    this.model.set(field.attr('data-id'), value);
  }

});
