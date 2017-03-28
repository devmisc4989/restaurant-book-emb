import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    this.send('pull');
  },

  actions: {
    menuModal: function() {
      $('#createMenu').modal('show');
    },

    pull: function() {
      var that = this;
      var auth = this.get('session.data.authenticated.authorization');
      var published = [];
      var drafts = [];

      function get(k) {
        return map[k];
      }


      Ember.$.ajax({
        type: "GET",
        headers: {
          'Authorization': auth
        },
        dataType: 'json',
        url: ENV.API.domain + "/business",
        success: function(restaurants) {
          that.set('restaurants', restaurants);
          that.set('active_restaurant', restaurants[0]);

          Ember.$.ajax({
            type: "GET",
            headers: {
              'Authorization': auth
            },
            dataType: 'json',
            url: ENV.API.domain + "/menu/",
            success: function(data) {

              for (var i = 0; i < data.length; i++) {
                if (data[i].business.id == restaurants[0].id) {
                  if (data[i].is_published) {
                    published.push(data[i]);
                  } else {
                    drafts.push(data[i]);
                  }
                }
              }

              that.set('menus_published', published);
              that.set('menus_drafted', drafts);
            },
            error: function(data) {
              console.log(data);
              that.toast.error('Error finding menus.', '', {
                positionClass: 'toast-top-full-width toast-fullnav'
              });
            },
          });
        },
        error: function(data) {
          alert("failed finding businesses");
        },
      });
    },

    findMenus: function(id, name) {

      var published = [];
      var drafts = [];

      var that = this;

      Ember.$.ajax({
        type: "GET",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/menu/",
        success: function(data) {

          for (var i = 0; i < data.length; i++) {
            if (data[i].business.id == id) {
              if (data[i].is_published) {
                published.push(data[i]);
              } else {
                drafts.push(data[i]);
              }
            }
          }
          that.set('active_restaurant', {
            name: name,
            id: id
          });
          that.set('menus_published', published);
          that.set('menus_drafted', drafts);
        },
        error: function(data) {
          console.log(data);
          that.toast.error('Error finding menus.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
        },
      });
    },

    createMenu: function() {

      var data = {
        title: Ember.$('#title').val(),
        description: Ember.$('#description').val(),
        business: Ember.$('#business_id').val()
      };

      var that = this;
      $('#createMenu').modal('hide');

      Ember.$.ajax({
        type: "POST",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/menu/",
        data: data,
        success: function(data) {
          that.toast.success('Menu created.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
          that.send('pull');
        },
        error: function(data) {
          that.toast.error('Error occured.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
        },
      });
    },

    deleteMenu: function(id) {

      var that = this;
      $('#createMenu').modal('hide');

      Ember.$.ajax({
        type: "DELETE",
        headers: {
          'Authorization': this.get('session.data.authenticated.authorization')
        },
        dataType: 'json',
        url: ENV.API.domain + "/menu/" + id,
        success: function(data) {
          that.toast.success('Menu deleted.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
          that.send('pull');
        },
        error: function(data) {
          that.toast.error('Error occured while deleting menu.', '', {
            positionClass: 'toast-top-full-width toast-fullnav'
          });
        },
      });
    },
  }

});
