'use strict';

let Marionette = require('backbone.marionette');

let Template = require('../templates/layout.hbs');

module.exports = Marionette.LayoutView.extend({

  template: Template,
  el: 'body',

  regions: {
    appState: '#region-app-state',
    foo:      '#region-foo',
    bar:      '#region-bar'
  },

});
