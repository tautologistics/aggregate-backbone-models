'use strict';

// Libs
let Marionette    = require('backbone.marionette');

// Application state + event bus (singleton)
let AppState      = require('./models/lib/AppState');

// Views
let LayoutView    = require('./views/Layout');
let AppStateView  = require('./views/AppState');
let FooView       = require('./views/Foo');
let BarView       = require('./views/Bar');

class Application extends Marionette.Application {

  initialize() {
    window.app = this;

    // Event handlers
    this.on('start', this.handleStart);
    this.on('error', this.handleError);

    // Views
    this.layoutView = new LayoutView();
    this.layoutView.render();

    this.layoutView.appState.show(new AppStateView({ model: AppState }));
    this.layoutView.foo.show(new FooView({ id: 1 }));
    this.layoutView.bar.show(new BarView({ id: 1 }));

    this.start();
  }

  handleStart() {
    AppState.set('currentId', 1);
  }

  handleError(err) {
    console.log('ERROR', err, err.stack);
  }

}

module.exports =  new Application();
