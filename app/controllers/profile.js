import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  actions: {
    updateUser: function() {

      var that = this;

      var data = {
        first_name: Ember.$('#first_name').val(),
        last_name: Ember.$('#last_name').val(),
        email: Ember.$('#email').val(),
      };

      var sessionObj = this.get('session');

      Ember.$.ajax({
        type: "PUT",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/user/" + this.get('session.data.user.id'),
        data: data,
        success: function(data) {
          sessionObj.set('data.user', data);
          that.toast.success('User updated.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
        },
        error: function(data) {
          that.toast.error('Error occured.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
        },
      });
    },

    updatePassword: function() {
      var data = {
        password: Ember.$('#password').val(),
        newPassword: Ember.$('#new_password').val(),
      };

      var that = this;

      Ember.$.ajax({
        type: "POST",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/auth/changePassword",
        data: data,
        success: function(data) {
          that.toast.success('Password updated.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
        },
        error: function(request, status, error) {
          that.toast.error('Error occured.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
        }
      });
    },
  },

});
