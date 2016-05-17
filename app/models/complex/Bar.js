'use strict';

// Libs
const $ = require('jquery');
const _ = require('underscore');
const ComplexModel = require('../lib/ComplexModel');

// Models
const TableB = require('../simple/TableB');
const TableC = require('../simple/TableC');

module.exports = class Foo extends ComplexModel {

  get _tableModels() {
    return this.tables = this.tables || {
      TableB: new TableB(),
      TableC: new TableC(),
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
    self.tables.TableB.id = self.id;
    self.tables.TableC.id = self.id;

    const defer = $.Deferred();

    // Fetch the table model data
    $.when([
      self.tables.TableB.fetch(),
      self.tables.TableC.fetch(),
    ]).done(function () {
      const id = self.id;
      // Merge and transform the table model data into the complex model
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
  }

  save() {
    // Pull out the complex model data that pertains to a table model
    this.tables.TableB.set(_.pick(this.toJSON(), Object.keys(this.tables.TableB.toJSON())));
    this.tables.TableC.set(_.pick(this.toJSON(), Object.keys(this.tables.TableC.toJSON())));

    // Save the data back to the table models
    return $.when([
      this.tables.TableB.save(),
      this.tables.TableC.save(),
    ]);
  }

};
