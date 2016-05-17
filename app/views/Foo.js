'use strict';

// Libs
let $ = require('jquery');
let Marionette = require('backbone.marionette');

// Models
let AppState = require('../models/lib/AppState');
let Model = require('../models/complex/Foo');

// Misc
let Template = require('../templates/foo.hbs');

module.exports = Marionette.ItemView.extend({

  id: 'foo-view',
  template: Template,

  events: {
    'change input': 'updateValue',
    'click .reload': 'load',
    'click .save': 'save',
  },

  initialize: function () {
    this.model = new Model();
    // Reload model when glocal "current ID" changes
    this.listenTo(AppState, 'change:currentId', this.load);
    // Rerender whenever the model changes
    this.listenTo(this.model, 'change', this.onChange.bind(this));
  },

  load: function () {
    // Get the "current ID" and fetch the model data
    this.model.id = AppState.get('currentId');
    this.model.fetch();
  },

  save: function () {
    this.model.save();
  },

  onChange: function () {
    this.render();
  },

  updateValue: function (e) {
    // Bind the form data changes to the model
    let field = $(e.currentTarget);
    let value = field.val();
    this.model.set(field.attr('data-id'), value);
  },

});
