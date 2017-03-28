import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',

  init() {
    var token = window.location.href;
    token = token.substring(token.indexOf('=') + 1, token.length);
    console.log(token);
    this.set('token', token);
  },

  actions: {
    reset: function() {

      var that = this;

      var data = {
        password: Ember.$('#password').val(),
        token: Ember.$('#token').val()
      };

      if (data.password == Ember.$('#password_confirm').val()) {

        Ember.$.ajax({
          type: "PUT",
          dataType: 'json',
          url: ENV.API.domain + "/auth/setPassword",
          data: data,
          success: function(response) {
            that.toast.success('Password successfully reset. Please login.');
            that.transitionToRoute('index');
          },
          error: function(data) {
            console.log(data);
            if (data.responseJSON) {
              that.toast.error(data.responseJSON.err, '', {
                positionClass: 'toast-top-center toast-reset-password'
              });
            } else {
              that.toast.error(data.responseText, '', {
                positionClass: 'toast-top-center toast-reset-password'
              });
            }
          }
        });
      } else {
        that.toast.error("Password Mismatch. Please try again.", '', {
          positionClass: 'toast-top-center toast-reset-password'
        });
      }
    },
  }

});
