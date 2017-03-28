import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',

  init() {
    var verification = window.location.href;
    verification = verification.substring(verification.indexOf('=') + 1, verification.length);
    console.log(verification);
    this.set('verification', verification);
  },

  actions: {

    checked: function() {
      var isChecked = $('#terms_accepted').is(':checked');
      // if (isChecked) {
      //   $('#sign-up').prop('disabled', false);
      // } else {
      //   $('#sign-up').prop('disabled', true);
      // }
      this.set('isChecked', isChecked);
    },

    verifyAccount: function() {

      var that = this;

      var data = {
        password: Ember.$('#password').val(),
        verification: Ember.$('#verification').val()
      };

      if (data.password == Ember.$('#password_confirm').val()) {
        Ember.$.ajax({
          type: "PUT",
          dataType: 'json',
          url: ENV.API.domain + "/auth/verify",
          data: data,
          success: function(response) {

            console.log(response);

            var credentials = {
              identification: response.user.email,
              password: data.password
            };
            that.get('session').authenticate('authenticator:custom', credentials).catch((reason) => {
              that.set('errorMessage', reason.error || reason);
            });
          },
          error: function(data) {
            console.log(data);
            if (data.responseJSON) {
              that.toast.error(data.responseJSON.err, '', {
                positionClass: 'toast-top-center toast-verify'
              });
            } else {
              that.toast.error(data.responseText, '', {
                positionClass: 'toast-top-center toast-verify'
              });
            }

          }
        });
      } else {
        that.toast.error("Password Mismatch. Please try again.", '', {
          positionClass: 'toast-top-center toast-verify'
        });
      }

    },
  }

});
