import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    io.socket.request({
      method: 'post',
      url: '/api/v1/action/subscribe',
      data: {
        room: this.get('session.data.user.id')
      },
      headers: {
        'Authorization': this.get('session.data.authenticated.authorization')
      }
    }, function(resData, jwres) {
      if (jwres.error) {
        console.log(jwres.statusCode); // => e.g. 403
        return;
      }
      console.log(resData); // => e.g. 200
    });
  }

});
