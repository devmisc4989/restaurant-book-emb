import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  actions: {

    signIn: function() {
      $('#verifyModal').modal('hide');
      this.transitionToRoute('index');
    },

    reset: function() {
      var data = {
        email: Ember.$('#email').val(),
      };

      var that = this;

      var email_address = data.email;

      Ember.$.ajax({
        type: "PUT",
        dataType: 'json',
        url: ENV.API.domain + "/auth/resetPassword",
        data: data,
        success: function(data) {
          that.set('email_address', email_address);
          $('#verifyModal').modal('show');
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

        },
      });
    },

    resend: function(email_address) {
      var that = this;
      var data = {
        email: email_address
      };
      Ember.$.ajax({
        type: "POST",
        dataType: 'json',
        url: ENV.API.domain + "/auth/resetPassword",
        data: data,
        success: function(data) {
          console.log(data);
          that.set('email_address', data.user.email);
          $('#verifyModal').modal('show');
          that.toast.success(data.responseJSON.msg);
        },
        error: function(data) {
          that.toast.error(data.responseJSON.err, '', {
            positionClass: 'toast-register'
          });
        },
      });
    },
  },

});
