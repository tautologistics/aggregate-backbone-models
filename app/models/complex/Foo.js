'use strict';

// Libs
const $ = require('jquery');
const _ = require('underscore');
const ComplexModel = require('../lib/ComplexModel');

// Models
const TableA = require('../simple/TableA');
const TableB = require('../simple/TableB');

module.exports = class Foo extends ComplexModel {

  get _tableModels() {
    return this.tables = this.tables || {
      TableA: new TableA(),
      TableB: new TableB(),
    };
  }

  constructor() {
    super();
  }

  initialize() {
    super.initialize();
    this.fetch();
  }

  fetch() {
    const self = this;

    // Create new table models
    self.tables.TableA.id = self.id;
    self.tables.TableB.id = self.id;

    const defer = $.Deferred();

    // Fetch the table model data
    $.when([
      self.tables.TableA.fetch(),
      self.tables.TableB.fetch(),
    ]).done(function () {
      const id = self.id;
      // Merge and transform the table model data into the complex model
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
  }

  save() {
    // Pull out the complex model data that pertains to a table model
    this.tables.TableA.set(_.pick(this.toJSON(), Object.keys(this.tables.TableA.toJSON())));
    this.tables.TableB.set(_.pick(this.toJSON(), Object.keys(this.tables.TableB.toJSON())));

    // Save the data back to the table models
    return $.when([
      this.tables.TableA.save(),
      this.tables.TableB.save(),
    ]);
  }

};
