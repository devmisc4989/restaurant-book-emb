// app/controllers/login.js
import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',

  actions: {

    authenticate: function() {
      var that = this;
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', credentials).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
        that.toast.error(JSON.parse(reason).err, '', {
          positionClass: 'toast-top-center toast-login'
        });
      });
    },

  }


});
