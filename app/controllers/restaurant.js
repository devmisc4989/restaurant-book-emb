import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    var that = this;
    var id = window.location.href.split("/")[4];
    console.log(id);
    Ember.$.ajax({
      type: "GET",
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      },
      dataType: 'json',
      url: ENV.API.domain + "/business/" + id,
      success: function(data) {
        console.log(data);
        that.set('restaurant', data);
      },
      error: function(data) {
        console.log(data);
        alert("failed");
      },
    });
  },

  actions: {

    submit: function() {
      Ember.$("#businessUpdateForm").submit();
    },

    gotoAccess: function(id) {
      this.transitionToRoute('access', id);
    },

    updateBusiness: function() {
      var id = Ember.$('#id').val();
      var data = {
        name: Ember.$('#name').val(),
        address: {
          line_1: Ember.$('#line_1').val(),
          line_2: Ember.$('#line_2').val(),
          city: Ember.$('#city').val(),
          region: Ember.$('#region').val(),
          country: Ember.$('#country').val(),
          postal_code: Ember.$('#postal_code').val(),
        },
        description: Ember.$('#description').val(),
        phone: Ember.$('#phone').val(),
        email: Ember.$('#email').val(),
        website: Ember.$('#website').val(),
      };

      var that = this;

      Ember.$.ajax({
        type: "PUT",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business/" + id,
        data: data,
        success: function(data) {
          that.set('restaurant', data);
          that.toast.success('Restaurant updated.', '', {
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
  }
});
