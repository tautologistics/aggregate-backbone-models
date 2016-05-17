'use strict';

const _ = require('underscore');

const SuperModel = require('backbone.supermodel');

const AppState = require('./AppState');

module.exports = class ComplexModel extends SuperModel {

  get _appState() { return AppState; }

  _tableModels() {
    return this.tables = this.tables || { };
  };

  initialize() {
    for (const modelKey in this._tableModels) {
      const modelName = this._tableModels[modelKey].constructor.name;
      this.listenTo(this._appState, `simplemodel:${modelName}:change`, this.onModelChange.bind(this, modelKey));
    }
    this.listenTo(this, 'all', this._appState.getComplexModelEmitter(this.constructor.name));
  }

  onModelChange(name, changedModel) {
    const ourModel = this.tables[name];
    if (!ourModel) {
      return
    }
    if (ourModel.id !== changedModel.id || changedModel.id === undefined) {
      return;
    }
    if (_.isEqual(ourModel.toJSON(), changedModel.toJSON())) {
      return;
    }
    this.fetch();
  }

};
