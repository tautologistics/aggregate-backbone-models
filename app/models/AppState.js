'use strict';

// Libs
let SuperModel = require('backbone.supermodel');

// Models
let AppState = new (SuperModel.extend({

  modelEvents: {
    'change:logs': 'render'
  },

  initialize: function () {
    // Event log buffers for demonstration purposes
    this.set('logs', {
      aggmodel: ['xxxx'],
      tablemodel: ['yyy'],
    }, { silent: true });

    // Pipe relevant events to the log buffers
    this.on('all', function (event, options) {
      console.log(event, options);
      var log = this.get('logs.' + event.split(':')[0]);
      if (log) {
        log.unshift(event + '\n');
        if (log.length > 100) {
          log.length = 100;
        }
      }
    });
  },

  /*
   * Creates a trigger function bound to a model type/name. e.g.:
   *   var triggerFoo = AppState._getModelEmitter('aggmodel', 'Foo');
   *   triggerFoo('change:bar');
   * Will emit two events:
   *   aggmodel:Foo:change:bar
   *   aggmodel:Foo:change
   */
  _getModelEmitter: function (prefix, modelName) {
    var self = this;
    return function (eventId, options) {
      setTimeout(function () {
        self.trigger(prefix + ':' + modelName + ':' + eventId, options);
        // if (eventId.split(':').length == 1) {
        //   this.trigger(prefix + ':' + modelName, options);
        // }
      }, 0);
    };
  },

  // Create an agg model event trigger function
  getAggmodelEmitter: function (modelName) {
    return this._getModelEmitter('aggmodel', modelName);
  },

  // Create a table model event trigger function
  getTablemodelEmitter: function (modelName) {
    return this._getModelEmitter('tablemodel', modelName);
  },

}))();

module.exports = AppState;