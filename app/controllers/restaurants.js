import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  fullAddress: null,
  googleAuto: null,
  restrictions: {
    country: "us"
  },

  init() {
    var that = this;
    Ember.$.ajax({
      type: "GET",
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      },
      dataType: 'json',
      url: ENV.API.domain + "/business",
      success: function(data) {
        that.set('restaurants', data);
      },
      error: function(data) {
        that.toast.error('Error occured!', '', {
          positionClass: 'toast-top-full-width toast-fullnav'
        });
      },
    });
  },

  actions: {

    addRestaurant: function() {
      $('#addRestaurant').modal('show');
    },

    createRestaurant: function() {
      var params = this.getProperties('name', 'lat', 'lng', 'opening_hours', 'line1', 'city', 'region', 'country', 'postal_code', 'description', 'phone', 'email', 'website', 'place_id', 'formatted_address');
      var that = this;
      $('#addRestaurant').modal('hide');

      var data = {
        name: params.name,
        formatted_address: params.formatted_address,
        opening_hours: JSON.parse(params.opening_hours),
        lat: params.lat,
        lng: params.lng,
        address: {
          line_1: params.line1,
          line_2: params.line2,
          city: params.city,
          region: params.region,
          country: params.country,
          postal_code: params.postal_code,
        },
        description: params.description,
        phone: params.phone,
        email: params.email,
        website: params.website,
        place_id: params.place_id
      };

      Ember.$.ajax({
        type: "POST",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business",
        data: data,
        success: function(data) {
          that.toast.success('Restaurant created!', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
          Ember.$.ajax({
            type: "GET",
            headers: {
              'Authorization': that.get('session.data.authenticated.authorization')
            },
            dataType: 'json',
            url: ENV.API.domain + "/business",
            success: function(data) {
              that.set('restaurants', data);
            },
            error: function(data) {
              that.toast.error('Error occured!', '', {
                positionClass: 'toast-top-full-width toast-fullnav'
              });
            },
          });
        },
        error: function(data) {
          console.log(data);
          that.toast.error('Error occured in creating a restaurant.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
        },
      });

    },

    deleteRestaurant: function(id) {
      var that = this;

      Ember.$.ajax({
        type: "DELETE",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business/" + id,
        success: function(data) {
          that.toast.success('Restaurant deleted!', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
          Ember.$.ajax({
            type: "GET",
            headers: {
              'Authorization': that.get('session.data.authenticated.authorization')
            },
            dataType: 'json',
            url: ENV.API.domain + "/business",
            success: function(data) {
              that.set('restaurants', data);
            },
            error: function(data) {
              that.toast.error('Error occured!', '', {
                positionClass: 'toast-top-full-width toast-fullnav'
              });
            },
          });
        },
        error: function(data) {
          that.toast.error('Error occured!', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
        },
      });
    },

    done() {
      Ember.$('#message').fadeOut(500, () => {
        this.set('message', 'Focus out');
      }).fadeIn(500);
    },

    placeChanged(place) {

      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();

      console.log(place)
      this.set('googleAuto', 'done');
      if (place.adr_address) {
        let regexp = /(<span(?: \w+="[^"]+")*(?: \w+="[^"]+")*>([^<]*)<\/span>)/g,
          fullAddress = place.adr_address.replace(regexp, "$2");

        var address_array = fullAddress.split(",");
        this.set('formatted_address', fullAddress);
        this.set('line1', address_array[0]);
        this.set('city', address_array[1]);
        this.set('lat', lat);
        this.set('lng', lng);
        this.set('region', address_array[2].split(" ")[1]);
        this.set('postal_code', address_array[2].split(" ")[2] + " " + address_array[2].split(" ")[3]);
        this.set('country', address_array[3]);
        this.set('place_id', place.place_id);
        this.set('website', place.website);
        this.set('phone', place.formatted_phone_number);
        this.set('name', place.name);
        this.set('opening_hours', JSON.stringify(place.opening_hours));
      }
    },

  }

});
