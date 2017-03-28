import Ember from 'ember';
import ENV from '../../config/environment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model(params) {
    var that = this;
    Ember.$.ajax({
      type: "GET",
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      },
      dataType: 'json',
      url: ENV.API.domain + "/menu/" + params.id,
      success: function(menu) {
        if (menu.fixed_price) {
          $("#fixed_price").prop("checked", true);
          $("#a_la_carte").prop("checked", false);
        } else {
          $("#fixed_price").prop("checked", false);
          $("#a_la_carte").prop("checked", true);
        }
        that.set('menu', params.id);
      },
      error: function(data) {
        alert("failed");
      },
    });
  }
});
