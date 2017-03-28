import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  actions: {

    details: function() {
      $('#description').hide();
      $('#details').show();
    },

    description: function() {
      $('#details').hide();
      $('#description').show();
    }


  },

});
