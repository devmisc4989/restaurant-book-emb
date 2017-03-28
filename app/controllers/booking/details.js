import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    this.send('pull');
  },

  actions: {

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

    filterContent: function(){
      return true;
    },

    sendProposal: function(booking_id){
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/sendproposal",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Proposal sent", // text of the snackbar
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

    followupFeedback: function(booking_id){
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/followupfeedback",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Feedback reminder sent", // text of the snackbar
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

    followupTentative: function(booking_id){
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/followuptentative",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Feedback reminder sent", // text of the snackbar
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
      var id = window.location.href.split("/")[5];
      var business_id;
      var customers_array = [];

      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + id,
         success: function(booking) {
           console.log(booking);
           var date = new Date(booking.date);
           $('#pickadate').datetimepicker({
             inline: true,
             defaultDate: date,
             sideBySide: true,
             format: 'MMMM D YYYY'
           });
           $('#pickatime').datetimepicker({
             inline: true,
             defaultDate: date,
             sideBySide: true,
             format: 'LT'
           });

           console.log(booking.inputs);
           that.set('booking', booking);
           that.set('booking_inputs', JSON.stringify(booking.inputs));
           that.set('booking_notes', JSON.stringify(booking.notes));
           that.set('booking_quotes', JSON.stringify(booking.quotes));
           business_id = booking.business.id;
           Ember.$.ajax({
              type:"GET",
              headers: {'Authorization': that.get('session.data.authenticated.authorization')},
              dataType: 'json',
              url: ENV.API.domain + "/comment",
              data: {
                booking: id
              },
              success: function(comments) {
                that.set('comments', comments);
                Ember.$.ajax({
                    type:"GET",
                    headers: {'Authorization': that.get('session.data.authenticated.authorization')},
                    dataType: 'json',
                    url: ENV.API.domain + "/customer/findByBusiness/" + business_id,
                    success: function(customers) {
                      console.log(customers);
                      for(var j=0; j<customers.length; j++){
                        customers_array.push({
                          id: customers[j].id,
                          name: customers[j].name,
                          email: customers[j].email,
                          phone: customers[j].phone
                        });
                      }
                      that.set('customers', customers_array);
                      that.set('all_customers', customers_array);
                      Ember.$.ajax({
                        type:"GET",
                        headers: {'Authorization': that.get('session.data.authenticated.authorization')},
                        dataType: 'json',
                        url: ENV.API.domain + "/feedback",
                        data: {
                          booking: id
                        },
                        success: function(feedbacks) {
                          that.set('feedbacks', feedbacks);
                          },
                          error: function(data) {
                            console.log(data);
                            //that.toast.error('Error finding feedback', '', {positionClass: 'toast-top-full-width toast-fullnav'});

                          },
                        });
                    },
                    error: function(data) {
                      console.log(data);
                      that.toast.error('Error finding customer', '', {positionClass: 'toast-top-full-width toast-fullnav'});
                    },
                  });
              },
              error: function(data) {
                that.toast.error('Error finding comments', '', {positionClass: 'toast-top-full-width toast-fullnav'});
              },
            });
         },
         error: function(data) {
           that.toast.error('Error finding booking', '', {positionClass: 'toast-top-full-width toast-fullnav'});
         },
       });
    },


    accept: function(booking_id) {
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/confirm",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Booking accepted", // text of the snackbar
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

    proposal: function(booking_id) {
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/accept",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Booking accepted", // text of the snackbar
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


    addComment: function(booking_id) {
      var that = this;
      var comment = Ember.$('#comment').val();
      Ember.$('#comment').val('');

      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/comment/sendComment/" + booking_id,
         data: {comment: comment},
         success: function(booking) {
           that.toast.success('Comment sent', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with inputs");
         },
       });
    },


    addNote: function(notes, booking_id) {

      notes = JSON.parse(notes);

      console.log(notes);

      var that = this;

      notes.push({
        note: Ember.$('#note').val(),
        position: notes.length
      });

      Ember.$('#note').val('');

      console.log(notes);

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {notes: notes},
         success: function(booking) {
           that.toast.success('Note added', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with inputs");
         },
       });
    },


    deleteNote: function(array, index, booking_id) {
      var that = this;
      array = JSON.parse(array);
      array.splice(index, 1);
      for (var j=0; j < array.length; j++) {
        array.position = j;
      }
      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {notes: array},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Note deleted', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.set('booking', booking);
           that.set('booking_inputs', JSON.stringify(booking.inputs));
           that.set('booking_notes', JSON.stringify(booking.notes));
           that.set('booking_quotes', JSON.stringify(booking.quotes));
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking notes");
         },
       });
    },

    deleteQuote: function(booking_inputs, input_index, quote_index, booking_id) {
      var inputs = JSON.parse(booking_inputs);
      var that = this;

      inputs[input_index].quotes.splice(quote_index, 1);

      for (var j=0; j < inputs[input_index].quotes.length; j++) {
        inputs[input_index].quotes[j].position = j;
      }

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Quote removed', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with quote");
         },
       });
    },

    deleteList: function(booking_inputs, input_index, list_index, booking_id) {
      var inputs = JSON.parse(booking_inputs);
      var that = this;

      inputs[input_index].lists.splice(list_index, 1);

      for (var j=0; j < inputs[input_index].lists.length; j++) {
        inputs[input_index].lists[j].position = j;
      }

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('List item removed', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with list");
         },
       });
    },


    addList: function(inputs, index, booking_id) {

      console.log(index);
      inputs = JSON.parse(inputs);
      var that = this;

      if (!inputs[index].lists) {
        inputs[index].lists = [];
      }

      inputs[index].lists.push({
        list: Ember.$('#list').val(),
        position: inputs[index].lists.length
      });

      Ember.$('#list').val('');

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('List added', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.set('booking', booking);
           that.set('booking_inputs', JSON.stringify(booking.inputs));
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with inputs");
         },
       });
    },


    addQuote: function(inputs, index, booking_id) {

      inputs = JSON.parse(inputs);
      var that = this;

      if (!inputs[index].quotes) {
        inputs[index].quotes = [];
      }

      inputs[index].quotes.push({
        quote: Ember.$('#quote').val(),
        position: inputs[index].quotes.length
      });

      Ember.$('#quote').val('');

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Note added', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.set('booking', booking);
           that.set('booking_inputs', JSON.stringify(booking.inputs));
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with inputs");
         },
       });
    },


    updateDate: function(booking_id) {
      var that = this;
      var new_date = Ember.$('#new-date').val();
      var current_date = Ember.$('#current-date').val();

      new_date = moment(new Date(new_date));
      current_date = moment(new Date(current_date));

      var date = new Date(new_date.year(), new_date.month(), new_date.date(), current_date.hour(), current_date.minute(), 0);
      date = date.toISOString();

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {date: date},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Event date updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },

    updateTime: function(booking_id) {
      var that = this;
      var new_date = Ember.$('#new-date-time').val();
      var current_date = Ember.$('#current-date-time').val();

      new_date = new_date.replace(" ", ':').split(":");

      if (new_date[2] == "PM") {
        new_date[0] = parseInt(new_date[0]) + 12;
      }

      current_date = moment(new Date(current_date));

      console.log(current_date.year());

      var date = new Date(current_date.year(), current_date.month(), current_date.date(), parseInt(new_date[0]),parseInt(new_date[1]), 0);
      console.log(date);

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {date: date},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Event date updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },

    submitGuestCount: function() {
     Ember.$("#number_of_guests_form").submit();
    },

    submitNotes: function() {
     Ember.$("#notes-form").submit();
    },

    submitDate: function() {
     Ember.$("#date-form").submit();
    },

    submitTime: function() {
     Ember.$("#time-form").submit();
    },

    updateGuestCount: function(booking_id) {
      var that = this;
      var number_of_guests = Ember.$('#number_of_guests').val();
      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {number_of_guests: number_of_guests},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Number of guests updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },

    updateNotes: function(booking_id) {
      var that = this;
      var notes = Ember.$('#notes').val();
      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {notes: notes},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Notes updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },


    submitGuestForm: function() {
     Ember.$("#guest_form").submit();
    },

    upload: function(booking_inputs, index, booking_id) {
      var file = Ember.$('#' + index + '-file').val();
      console.log(file);
      console.log('running');
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         cache: false,
         contentType: false,
         url: ENV.API.domain + "/booking/upload",
         data: {file: file},
         success: function(path) {
           console.log(path);
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },

    updateGuest: function(booking_id) {
      var that = this;

      var contact = {
        name: Ember.$('#contact_name').val(),
        email: Ember.$('#contact_email').val(),
        phone: Ember.$('#contact_phone').val(),
      };

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {contact: contact},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Guest info updated', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking date");
         },
       });
    },


    close: function(booking_id) {
      console.log(booking_id);
      var that = this;
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/close",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Booking closed", // text of the snackbar
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

    decline: function(booking_id) {
      console.log(booking_id);
      Ember.$.ajax({
         type:"POST",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id + "/decline",
         success: function(data) {
          console.log(data);
           var options =  {
              content: "Booking declined", // text of the snackbar
              style: "toast", // add a custom class to your snackbar
              timeout: 3000, // time in milliseconds after the snackbar autohides, 0 is disabled
            }
            $.snackbar(options);
         },
         error: function(data) {
           console.log(data);
           alert("failed");
         },
       });
    },

    submitElementForm: function(index) {
     Ember.$("#" + index + "-form").submit();
    },

    saveElement: function(booking_inputs, index, booking_id) {
      var inputs = JSON.parse(booking_inputs);
      var that = this;

      inputs[index].value = Ember.$('#' + index + '-value').val();

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': that.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with menus");
         },
       });
    },


    addMenu: function(booking_inputs, index, menu_id, booking_id) {
      console.log("running add menu");
      var inputs = JSON.parse(booking_inputs);
      var that = this;

      if (!inputs[index].selections) {
        inputs[index].selections = [];
      }

      Ember.$.ajax({
         type:"GET",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/menu/" + menu_id,
         success: function(menu) {
           menu.position = inputs[index].selections.length;
           inputs[index].selections.push(menu);
           console.log(menu.fixed_price);

           if (menu.fixed_price) {

             var quote_index = _.findIndex(inputs, function(o) { return o.type == 'quote'; });
             if (quote_index < 0) {
               inputs.push({
                 type: "quote",
                 position: inputs.length,
                 quotes: [{
                   quote: menu.inputs.fixed_price.amount,
                   position: 0
                 }],
                 label: "Quotes"
               });
             } else {
               if (!inputs[index].quotes) {
                 inputs[index].quotes = [];
               }
               inputs[quote_index].quotes.push({
                 quote: menu.inputs.fixed_price.amount,
                 position: inputs[index].quotes.length
               });
             }

           }

           console.log(inputs);

           Ember.$.ajax({
              type:"PUT",
              headers: {'Authorization': that.get('session.data.authenticated.authorization')},
              dataType: 'json',
              url: ENV.API.domain + "/booking/" + booking_id,
              data: {inputs: inputs},
              success: function(booking) {
                that.send('pull');
              },
              error: function(data) {
                console.log(data);
                alert("failed to update booking with menus");
              },
            });
         },
         error: function(data) {
           alert("failed to find menu");
         },
       });
    },

    deleteMenu: function(booking_inputs, input_index, menu_index, booking_id) {
      var inputs = JSON.parse(booking_inputs);
      var that = this;

      inputs[input_index].selections.splice(menu_index, 1);

      for (var j=0; j < inputs[input_index].selections.length; j++) {
        inputs[input_index].selections[j].position = j;
      }

      Ember.$.ajax({
         type:"PUT",
         headers: {'Authorization': this.get('session.data.authenticated.authorization')},
         dataType: 'json',
         url: ENV.API.domain + "/booking/" + booking_id,
         data: {inputs: inputs},
         success: function(booking) {
           console.log(booking);
           that.toast.success('Menu removed', '', {positionClass: 'toast-top-full-width toast-subnav'});
           that.send('pull');
         },
         error: function(data) {
           console.log(data);
           alert("failed to update booking with menus");
         },
       });
    },

  }

});
