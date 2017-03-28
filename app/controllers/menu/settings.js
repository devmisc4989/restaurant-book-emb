import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  actions: {
    selectType: function(id) {

      var fixed_price = $('input[name=optionsRadios]:checked', '#myForm').val();
      Ember.$.ajax({
        type: "PUT",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/menu/" + id,
        data: {
          fixed_price: fixed_price
        },
        success: function(menu) {
          if (menu.fixed_price) {
            $("#fixed_price").prop("checked", true);
            $("#a_la_carte").prop("checked", false);
          } else {
            $("#fixed_price").prop("checked", false);
            $("#a_la_carte").prop("checked", true);
          }
        },
        error: function(data) {
          that.toast.error('Menu couldn\'t be saved.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
        },
      });
    },
  },

});
