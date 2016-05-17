'use strict';

const _ = require('underscore');

const SuperModel = require('backbone.supermodel');

const AppState = require('./AppState');

module.exports = class SimpleModel extends SuperModel {

  get _validAttribs() { return null; }

  get _appState() { return AppState; }

  initialize() {
    this.listenTo(this, 'all', this._appState.getSimpleModelEmitter(this.constructor.name));
  }

  toJSON() {
    const json = super.toJSON.apply(this, arguments);
    return this._validAttribs ? _.pick(json, this._validAttribs) : json;
  }

};
