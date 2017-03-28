/* jshint node: true */

module.exports = function(environment) {

  var ENV = {
    modulePrefix: 'menucloud',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    API: {
      //domain: "http://localhost:1337/api/v1",
      domain: "http://dev-api.menucloud.io/api/v1",
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['ember-simple-auth'] = {
    //store: 'simple-auth-session-store:local-storage',
    authorizer: 'authorizer:custom',
    //authorizer: 'authorizer:oath2',
    //crossOriginWhitelist: ['http://localhost:1337'],
    crossOriginWhitelist: ['http://dev-api.menucloud.io'],
    //baseURL: '',
    authenticationRoute: 'index',
    routeAfterAuthentication: 'dashboard'
  };


  ENV['ember-toastr'] = {
    injectAs: 'toast',
    toastrOptions: {
      "closeButton": false,
      "debug": true,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-full-width",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  };

  ENV['place-autocomplete'] = {
    exclude: false,
    key: 'AIzaSyByevc1RMd5b-qTYl0oCZE-yfvZNTwDVw4'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.API_URL = "http://dev-api.menucloud.io/api/v1";
  }

  return ENV;
};
