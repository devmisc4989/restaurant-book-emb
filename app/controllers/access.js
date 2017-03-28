import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    this.send('pull');
  },

  actions: {

    pull: function() {
      var that = this;
      var id = window.location.href.split("/")[4];
      console.log(id);
      Ember.$.ajax({
        type: "GET",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business/" + id,
        success: function(data) {
          console.log(data);
          that.set('restaurant', data);
          that.set('users', JSON.stringify(data.users));
        },
        error: function(data) {
          console.log(data);
          alert("failed");
        },
      });
    },

    gotoContact: function(id) {
      console.log(id);
      this.transitionToRoute('restaurant', id);
    },

    removeCollaborator: function(users, id, business_id) {
      var that = this;
      var users = JSON.parse(users);

      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          users.splice(i, 1);
        }
      }

      console.log(users);

      if (users.length === 0) {
        users = JSON.stringify(users);
      }

      Ember.$.ajax({
        type: "PUT",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business/" + business_id,
        data: {
          users: users
        },
        success: function(data) {
          that.toast.success('Removed collaborator.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
          that.send('pull');
        },
        error: function(data) {
          console.log(data);
          that.toast.success('Removed collaborator.', '', {
            positionClass: 'toast-top-full-width toast-subnav'
          });
          that.send('pull');
        },
      });
    },

    addCollaborator: function() {
      $('#addCollaborator').modal('show');
    },

    addUser: function() {
      var params = this.getProperties('first_name', 'last_name', 'email');
      var data = {
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
      };
      var that = this;
      var id = window.location.href.split("/")[4];
      $('#addCollaborator').modal('hide');
      Ember.$.ajax({
        type: "POST",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/business/addUser/" + id,
        data: data,
        success: function(data) {
          that.toast.success('Collaborator added successfully');
          that.set('restaurant', data);
          that.set('users', JSON.stringify(data.users));
        },
        error: function(data) {
          that.toast.error("Error occured while adding collaborator");
        },
      });
    },

  }
});
