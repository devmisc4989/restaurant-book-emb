/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    hinting: false
  });


	app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');
  app.import('bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');

  app.import('bower_components/jquery/dist/jquery.min.js');
  app.import('bower_components/moment/moment.js');
  app.import('vendor/js/materialize.js');
  app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
  app.import('bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');

  app.import('vendor/js/screenfull.js');

  app.import('vendor/js/modernizr-2.6.2.min.js');

  app.import('vendor/js/autosize.min.js');

  /* Sails Sockets */
  app.import('vendor/js/sails.io.js');


  /* SnackBar.Js */
  app.import('vendor/css/snackbar.min.css');
  app.import('vendor/js/snackbar.min.js');

  /* PDF Make */
  app.import('bower_components/pdfmake/build/pdfmake.js');
  app.import('bower_components/pdfmake/build/vfs_fonts.js');

  app.import('vendor/material/css/bootstrap-material-design.css');
  app.import('vendor/material/css/bootstrap-material-design.css.map');
  app.import('vendor/material/css/bootstrap-material-design.min.css');
  app.import('vendor/material/css/bootstrap-material-design.min.css.map');
  app.import('vendor/material/css/ripples.css.map');
  app.import('vendor/material/css/ripples.min.css');
  app.import('vendor/material/css/ripples.min.css.map');

  app.import('vendor/material/js/material.js');
  app.import('vendor/material/js/material.min.js');
  app.import('vendor/material/js/material.min.js.map');
  app.import('vendor/material/js/ripples.min.js');
  app.import('vendor/material/js/ripples.min.js.map');

  app.import('vendor/js/typeahead.jquery.js');


	/* Font Awesome */
  app.import('bower_components/font-awesome/css/font-awesome.min.css');
	app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf',{destDir: '/fonts/'});
	app.import('bower_components/font-awesome/fonts/fontawesome-webfont.eot',{destDir: '/fonts/'});
	app.import('bower_components/font-awesome/fonts/fontawesome-webfont.svg',{destDir: '/fonts/'});
	app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff',{destDir: '/fonts/'});
	app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff2',{destDir: '/fonts/'});
	app.import('bower_components/font-awesome/fonts/FontAwesome.otf',{destDir: '/fonts/'});

  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',{destDir: '/fonts/'});
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',{destDir: '/fonts/'});
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',{destDir: '/fonts/'});
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',{destDir: '/fonts/'});
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',{destDir: '/fonts/'});



  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
