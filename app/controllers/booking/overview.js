import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    var that = this;
    io.socket.on("booking", function(data){
      console.log(JSON.stringify(data.message));
      that.send('pull');
    });
    this.send('pull');
  },

  actions: {

    filterContent: function(){
      return true;
    },

    typeahead: function(customers) {
      var query = Ember.$('#contact_name').val();
      var filter = [];
      for (var i=0; i<customers.length; i++) {
        if (customers[i].name.includes(query)) {
          filter.push(customers[i]);
        }
      }

      if (query.length > 2) {
        $('#customers-list').show();
        console.log(filter);
        this.set('customers', filter);
      } else {
        $('#customers-list').hide();
        this.set('customers', customers);
      }

    },

    deleteBooking: function(booking_id){
      var that = this;
      Ember.$.ajax({
         type:"DELETE",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Booking deleted", // text of the snackbar
              style: "toast", // add a custom class to your snackbar
              timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
            }
            $.snackbar(options);
            that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed");
         },
       });
    },

    search: function(all_bookings){
      var bookings = JSON.parse(all_bookings);
      var query = Ember.$('#query').val();
      console.log(query);

      var filter = [];

      for (var i=0; i<bookings.length; i++) {
        if (bookings[i].contact.name.includes(query)) {
          filter.push(bookings[i]);
        }
      }

      if (query.length > 1) {
        this.set('bookings', filter);
      } else {
        this.set('bookings', bookings);
      }
    },

    addSelectedItem(contact_id) {

      var that = this;
      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/customer/" + contact_id,
         success: function(data) {
           console.log(data);
           Ember.$('#contact_name').val(data.name);
           Ember.$('#contact_email').val(data.email);
           Ember.$('#contact_phone').val(data.phone);
           $('#customers-list').hide();
         },
         error: function(data) {
           console.log(data);
           if (data.responseJSON) {
             that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }else{
             that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }
         },
       });

    },

    pull: function() {
      var that = this;
      var bookings = [];
      var bookings_attention = [];
      var customers = [];
      var business_id;

      var stats = {
        incoming: 0,
        proposals: 0,
        tentatives: 0,
        confirmed: 0
      };

      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/business/",
         success: function(restaurants) {
           that.set('restaurants', restaurants);
           that.set('active_restaurant', restaurants[0]);
           business_id = restaurants[0].id;
           console.log(restaurants);
           io.socket.request({
              method: 'post',
              url: '/api/v1/action/subscribe',
              data: {
                room: business_id
              },
              headers: {
                'Authorization': that.get('session.data.authenticated.authorization')
              }
            }, function (resData, jwres) {
              if (jwres.error) {
                console.log(jwres.statusCode); // => e.g. 403
              }
              console.log(resData); // => e.g. 200
            });
           Ember.$.ajax({
              type:"GET",
              headers: {'Authorization': that.get('session.data.authenticated.authorization')},
              dataType: 'json',
              url: ENV.API.domain + "/booking",
              success: function(data) {
                console.log(data);

                for (var i=0; i < data.length; i++) {
                  if (data[i].business.id == restaurants[0].id) {

                    if (data[i].has_reminder) {
                      bookings_attention.push(data[i]);
                      if (data[i].stage == "pending") {
                        stats.incoming++;
                      } else if (data[i].stage == "proposal" || data[i].stage == "revision"){
                        stats.proposals++;
                      } else if (data[i].stage == "confirmed") {
                        stats.confirmed++;
                      }
                    } else if (data[i].stage == "pending" && data[i].from_api) {
                      stats.incoming++;
                      bookings_attention.push(data[i]);
                    } else if (data[i].stage == "proposal" || data[i].stage == "revision") {
                      stats.proposals++;
                      bookings_attention.push(data[i]);
                    } else if (data[i].stage == "tentative") {
                      stats.tentatives++;
                    } else if (data[i].stage == "confirmed" || data[i].stage == "feedback") {
                      stats.confirmed++;
                    }
                    bookings.push(data[i]);
                  }   
                }

                bookings.sort(function(a,b){
    							return new Date(a.date) - new Date(b.date);
    						});
                bookings_attention.sort(function(a,b){
    							return new Date(a.date) - new Date(b.date);
    						});

                that.set('stats', stats);
                that.set('bookings', bookings);
                that.set('all_bookings', JSON.stringify(bookings));
                that.set('bookings_attention', bookings_attention);
                Ember.$.ajax({
                   type:"GET",
                   headers: {'Authorization': that.get('session.data.authenticated.authorization')},
                   dataType: 'json',
                   url: ENV.API.domain + "/bookingType",
                   data: {
                     business: business_id
                   },
                   success: function(booking_types) {
                     console.log("booking_types: " + booking_types);
                     that.set('booking_types', booking_types);

                     Ember.$.ajax({
                        type:"GET",
                        headers: {'Authorization': that.get('session.data.authenticated.authorization')},
                        dataType: 'json',
                        url: ENV.API.domain + "/customer/findByBusiness/" + business_id,
                        success: function(customer_data) {
                          console.log("customer_data: " + customer_data);
                          for (var z = 0; z<customer_data.length; z++) {
                            customers.push({
                              id: customer_data[z].id,
                              name: customer_data[z].name,
                              email: customer_data[z].email,
                              phone: customer_data[z].phone
                            });
                          }
                          that.set('customers', customers);
                          that.set('all_customers', customers);
                        },
                        error: function(data) {
                          console.log(data);
                          if (data.responseJSON) {
                            that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                          }else{
                            that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                          }
                        },
                      });
                   },
                   error: function(data) {
                     console.log(data);
                     if (data.responseJSON) {
                       that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                     }else{
                       that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                     }
                   },
                 });
              },
              error: function(data) {
                if (data.responseJSON) {
                  that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                }else{
                  that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                }
              },
            });
         },
         error: function(data) {
           console.log(data);
           if (data.responseJSON) {
             that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }else{
             that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }
         },
       });
    },


    bookingModal: function() {
      $('#datetimepicker12').datetimepicker({
        defaultDate: new Date()
      });

      $('#createBooking').modal('show');
    },

    findBookings: function(id, name) {

      var that = this;
      var bookings = [];
      var bookings_attention = [];
      var business_id;
      var customers = [];

      var stats = {
        incoming: 0,
        proposals: 0,
        tentatives: 0,
        confirmed: 0
      };


      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking",
         success: function(data) {

           for (var i=0; i < data.length; i++) {
             if (data[i].business.id == id) {
               if (data[i].has_reminder) {
                 bookings_attention.push(data[i]);
                 if (data[i].stage == "pending") {
                   stats.incoming++;
                 } else if (data[i].stage == "proposal" || data[i].stage == "revision"){
                   stats.proposals++;
                 } else if (data[i].stage == "confirmed") {
                   stats.confirmed++;
                 }
               } else if (data[i].stage == "pending" && data[i].from_api) {
                 stats.incoming++;
                 bookings_attention.push(data[i]);
               } else if (data[i].stage == "proposal" || data[i].stage == "revision") {
                 stats.proposals++;
                 bookings_attention.push(data[i]);
               } else if (data[i].stage == "tentative") {
                 stats.tentatives++;
                 //bookings.push(data[i]);
               } else if (data[i].stage == "confirmed" || data[i].stage == "feedback") {
                 stats.confirmed++;
                // bookings.push(data[i]);
               }
              bookings.push(data[i]);
             }
           }
           bookings.sort(function(a,b){
             return new Date(a.date) - new Date(b.date);
           });
           bookings_attention.sort(function(a,b){
             return new Date(a.date) - new Date(b.date);
           });

           that.set('active_restaurant', {
             name: name,
             id: id
           });

           that.set('stats', stats);
           that.set('all_bookings', JSON.stringify(bookings));
           that.set('bookings', bookings);
           that.set('bookings_attention', bookings_attention);
           business_id = id;
           Ember.$.ajax({
              type:"GET",
              headers: {'Authorization': that.get('session.data.authenticated.authorization')},
              dataType: 'json',
              url: ENV.API.domain + "/bookingType",
              data: {
                business: business_id
              },
              success: function(booking_types) {
                console.log("booking_types: " + booking_types);
                that.set('booking_types', booking_types);

                Ember.$.ajax({
                   type:"GET",
                   headers: {'Authorization': that.get('session.data.authenticated.authorization')},
                   dataType: 'json',
                   url: ENV.API.domain + "/customer/findByBusiness/" + business_id,
                   success: function(customer_data) {
                     console.log("customer_data: " + customer_data);
                     for (var z = 0; z<customer_data.length; z++) {
                       customers.push({
                         id: customer_data[z].id,
                         name: customer_data[z].name,
                         email: customer_data[z].email,
                         phone: customer_data[z].phone
                       });
                     }
                     that.set('customers', customers);
                     that.set('all_customers', customers);
                   },
                   error: function(data) {
                     console.log(data);
                     if (data.responseJSON) {
                       that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                     }else{
                       that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                     }
                   },
                 });
              },
              error: function(data) {
                console.log(data);
                if (data.responseJSON) {
                  that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                }else{
                  that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
                }
              },
            });
         },
         error: function(data) {
           console.log(data);
           if (data.responseJSON) {
             that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }else{
             that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
           }
         },
       });
    },

    createBooking: function() {

      var that = this;

      var data = {
          contact: {
            name: Ember.$('#contact_name').val(),
            email: Ember.$('#contact_email').val(),
            phone: Ember.$('#contact_phone').val()
          },
          notes: Ember.$('#notes').val(),
          date: new Date(Ember.$('#date').val()).toISOString(),
          number_of_guests: parseInt(Ember.$('#number_of_guests').val()),
          business: Ember.$('#business_id').val(),
          booking_type: Ember.$('#booking_type').val(),
          inputs: {
            notes: [],
            quotes: [],
            menus: []
          },
      };

      if (data.contact.name && data.contact.email && data.number_of_guests && data.date && data.number_of_guests >= 0){
        //console.log(data);

        $('#createBooking').modal('hide');

        Ember.$.ajax({
           type:"POST",
           headers: {'Authorization': this.get('session.data.authenticated.authorization')},
           dataType: 'json',
           url: ENV.API.domain + "/booking",
           data: data,
           success: function(data) {
            console.log(data);
             var options =  {
                content: "Booking created", // text of the snackbar
                style: "toast", // add a custom class to your snackbar
                timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
              }
              $.snackbar(options);
              that.send('pull');
              Ember.$('#contact_name').val('');
              Ember.$('#contact_email').val('');
              Ember.$('#contact_phone').val('');
              Ember.$('#notes').val('');
              Ember.$('#number_of_guests').val('');
           },
           error: function(data) {
             if (data.responseJSON) {
               that.toast.error(data.responseJSON.err, '', {positionClass: 'toast-top-full-width toast-fullnav'});
             }else{
               that.toast.error(data.responseText, '', {positionClass: 'toast-top-full-width toast-fullnav'});
             }
           },
         });
      } else {
        that.toast.error('Please make sure you provide a contact name, email, and number of guests', '', {positionClass: 'toast-top-full-width toast-fullnav'});

      }


    },


  }
});
