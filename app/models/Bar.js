'use strict';

// Libs
let $ = require('jquery');
let _ = require('underscore');
let SuperModel = require('backbone.supermodel');

// Models
let AppState = require('../models/AppState');
let TableB = require('./tables/TableB');
let TableC = require('./tables/TableC');

// Misc
let Emitter = AppState.getAggmodelEmitter('Bar');

module.exports = SuperModel.extend({

  initialize: function () {
    // Set up table model structure
    this.tables = {
      TableB: new TableB(),
      TableC: new TableC(),
    };
    // Listen for changes to underlying models
    this.listenTo(AppState, 'tablemodel:TableB:change', this.onTableModelChange.bind(this, 'TableB'));
    this.listenTo(AppState, 'tablemodel:TableC:change', this.onTableModelChange.bind(this, 'TableC'));
    // Pipe all model events to AppState
    this.listenTo(this, 'all', Emitter);
    // Load the model data
    this.fetch();
  },

  onTableModelChange: function (name, extModel) {
    var intModel = this.tables[name];
    if (!intModel) {
      return
    }
    if (intModel.id !== extModel.id || extModel.id === undefined) {
      return;
    }
    if (_.isEqual(intModel.toJSON(), extModel.toJSON())) {
      return;
    }
    // console.log('Bar::onTableModelChange()', name, intModel.cid, extModel.cid, intModel.toJSON(), extModel.toJSON());
    this.fetch();
  },

  fetch: function () {
    var self = this;

    // Create new table models
    self.tables.TableB.id = self.id;
    self.tables.TableC.id = self.id;

    var defer = $.Deferred();

    // Fetch the table model data
    $.when([
      self.tables.TableB.fetch(),
      self.tables.TableC.fetch(),
    ]).done(function () {
      var id = self.id;
      // Merge and transform the table model data into the agg model
      self.clear();
      self.set(_.extend({},
        self.tables.TableB.toJSON(),
        self.tables.TableC.toJSON(),
        { total: self.tables.TableB.get('total') + self.tables.TableC.get('total') },
        { id: id }
      ));
      defer.resolve();
    });

    return defer.promise;
  },

  save: function () {
    // Pull out the agg model data that pertains to a table model
    this.tables.TableB.set(_.pick(this.toJSON(), Object.keys(this.tables.TableB.toJSON())));
    this.tables.TableC.set(_.pick(this.toJSON(), Object.keys(this.tables.TableC.toJSON())));

    // Save the data back to the table models
    return $.when([
      this.tables.TableB.save(),
      this.tables.TableC.save(),
    ]);
  },

});
