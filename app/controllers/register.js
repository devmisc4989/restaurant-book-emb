import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  actions: {

    signIn: function() {
      $('#verifyModal').modal('hide');
      this.transitionToRoute('index');
    },

    checked: function() {
      var isChecked = $('#terms_accepted').is(':checked');
      if (isChecked) {
        $('#sign-up').prop('disabled', false);
      } else {
        $('#sign-up').prop('disabled', true);
      }
      this.set('isChecked', isChecked);
    },

    createUser: function() {

      var params = this.getProperties('place_id', 'lat', 'lng', 'opening_hours', 'line1', 'city', 'region', 'country', 'postal_code', 'formatted_address', 'name', 'international_phone_number', 'formatted_phone_number', 'website');

      var data = {
        first_name: Ember.$('#first_name').val(),
        last_name: Ember.$('#last_name').val(),
        email: Ember.$('#email').val(),
        place_data: {
          lat: params.lat,
          lng: params.lng,
          place_id: params.place_id,
          opening_hours: JSON.parse(params.opening_hours),
          address: {
            line_1: params.line1,
            line_2: "",
            city: params.city,
            region: params.region,
            country: params.country,
            postal_code: params.postal_code,
          },
          website: params.website,
          name: params.name,
          phone: params.formatted_phone_number,
          formatted_address: params.formatted_address,
          international_phone_number: params.international_phone_number,
        }
      };

      var that = this;

      Ember.$.ajax({
        type: "POST",
        dataType: 'json',
        url: ENV.API.domain + "/auth/register",
        data: data,
        success: function(data) {
          console.log(data);
          that.set('email_address', data.user.email);
          $('#verifyModal').modal('show');
        },
        error: function(data) {
          if (data.responseJSON) {
            that.toast.error(data.responseJSON.err, '', {
              positionClass: 'toast-top-center toast-register'
            });
          } else {
            that.toast.error(data.responseText, '', {
              positionClass: 'toast-top-center toast-register'
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
        url: ENV.API.domain + "/auth/getVerified",
        data: data,
        success: function(data) {
          console.log(data);
          that.set('email_address', data.user.email);
          //$('#verifyModal').modal('show');
          that.toast.success(data.responseJSON.msg, '', {
            positionClass: 'toast-register'
          });
        },
        error: function(data) {
          that.toast.error(data.responseJSON.err, '', {
            positionClass: 'toast-register'
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
      console.log(place);

      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();

      this.set('googleAuto', 'done');
      if (place.adr_address) {
        let regexp = /(<span(?: \w+="[^"]+")*(?: \w+="[^"]+")*>([^<]*)<\/span>)/g,
          fullAddress = place.adr_address.replace(regexp, "$2");

        var address_array = fullAddress.split(",");
        this.set('formatted_address', fullAddress);
        this.set('place_id', place.place_id);
        this.set('name', place.name);
        this.set('lat', lat);
        this.set('lng', lng);
        this.set('line1', address_array[0]);
        this.set('city', address_array[1]);
        this.set('region', address_array[2].split(" ")[1]);
        this.set('postal_code', address_array[2].split(" ")[2] + " " + address_array[2].split(" ")[3]);
        this.set('country', address_array[3]);
        this.set('international_phone_number', place.international_phone_number);
        this.set('formatted_phone_number', place.formatted_phone_number);
        this.set('website', place.website);
        this.set('opening_hours', JSON.stringify(place.opening_hours));
      }
    },
  },

});
