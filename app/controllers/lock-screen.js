// app/controllers/login.js
import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',

  init() {
    console.log("run");
    this.set('session.data.authenticated.authorization', "none");
  },

  actions: {

    authenticate: function() {
      var that = this;
      var params = this.getProperties('password');

      var credentials = {
        identification: this.get('session.data.user.email'),
        password: params.password
      };

      Ember.$.ajax({
        url: ENV.API.domain + "/auth/login",
        type: 'POST',
        data: JSON.stringify({
          email: credentials.identification,
          password: credentials.password
        }),
        contentType: 'application/json;charset=utf-8',
        dataType: 'json'
      }).then(function(response) {
        that.set('session.data.authenticated.authorization', response.authorization);
        that.transitionToRoute('dashboard');
      }, function(xhr, status, error) {
        that.toast.error('Incorrect Password', '', {
          positionClass: 'toast-top-center toast-login'
        });
        // that.get('session').invalidate();
        // that.transitionToRoute('index');
      });


    },

  }


});
