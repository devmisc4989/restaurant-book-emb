import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  session: Ember.inject.service('session'),

  beforeModel() {
    var sessionObj = this.get('session');
    if (sessionObj.get('isAuthenticated')) {
      this.transitionTo('dashboard');
    }
  },

  sessionAuthenticated() {
    var that = this;
    var sessionObj = this.get('session');
    Ember.$.ajax({
      type: "GET",
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      },
      dataType: 'json',
      url: "http://localhost:1337/api/v1/auth/me",
      success: function(data) {
        console.log(data);
        sessionObj.set('data.user', data);
        //that.transitionTo('dashboard');
        that.transitionTo('dashboard');
      },
      error: function(data) {
        sessionObj.invalidate();
      },
    });
  }
});
