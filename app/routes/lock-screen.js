import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: Ember.inject.service('session'),
	actions: {
    willTransition(transition) {
			if(this.get('session.data.authenticated.authorization') === "none"){
				transition.abort();
				this.get('session').invalidate();
			} else {
				return true;
			}
    }
  }
});
