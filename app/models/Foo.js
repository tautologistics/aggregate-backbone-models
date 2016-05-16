'use strict';

// Libs
let $ = require('jquery');
let _ = require('underscore');
let SuperModel = require('backbone.supermodel');

// Models
let AppState = require('../models/AppState');
let TableA = require('./tables/TableA');
let TableB = require('./tables/TableB');

// Misc
let Emitter = AppState.getAggmodelEmitter('Foo');

module.exports = SuperModel.extend({

  initialize: function () {
    // Set up table model structure
    this.tables = {
      TableA: new TableA(),
      TableB: new TableB(),
    };
    // Listen for changes to underlying models
    this.listenTo(AppState, 'tablemodel:TableA:change', this.onTableModelChange.bind(this, 'TableA'));
    this.listenTo(AppState, 'tablemodel:TableB:change', this.onTableModelChange.bind(this, 'TableB'));
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
    // console.log('Foo::onTableModelChange()', name, intModel.cid, extModel.cid, intModel.toJSON(), extModel.toJSON());
    this.fetch();
  },

  fetch: function () {
    var self = this;

    // Create new table models
    self.tables.TableA.id = self.id;
    self.tables.TableB.id = self.id;

    var defer = $.Deferred();

    // Fetch the table model data
    $.when([
      self.tables.TableA.fetch(),
      self.tables.TableB.fetch(),
    ]).done(function () {
      var id = self.id;
      // Merge and transform the table model data into the agg model
      self.clear();
      self.set(_.extend({},
        self.tables.TableA.toJSON(),
        self.tables.TableB.toJSON(),
        { total: self.tables.TableA.get('total') + self.tables.TableB.get('total') },
        { id: id }
      ));
      defer.resolve();
    });

    return defer.promise;
  },

  save: function () {
    // Pull out the agg model data that pertains to a table model
    this.tables.TableA.set(_.pick(this.toJSON(), Object.keys(this.tables.TableA.toJSON())));
    this.tables.TableB.set(_.pick(this.toJSON(), Object.keys(this.tables.TableB.toJSON())));

    // Save the data back to the table models
    return $.when([
      this.tables.TableA.save(),
      this.tables.TableB.save(),
    ]);
  },

});
