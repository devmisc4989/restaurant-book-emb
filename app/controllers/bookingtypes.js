import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();

    var that = this;
    var published = [];
    var drafts = [];
    var restaurants = [];

    Ember.$.ajax({
      type: "GET",
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      },
      dataType: 'json',
      url: ENV.API.domain + "/business/",
      success: function(data) {
        console.log(data);

        for (var i = 0; i < data.length; i++) {
          restaurants.push({
            name: data[i].name,
            id: data[i].id,
            booking_type: data[i].booking_type
          });
        }

        that.set('active_restaurant', restaurants[0]);
        that.set('restaurants', restaurants);
      },
      error: function(data) {
        console.log(data);
        alert("failed");
      },
    });
  },


});
