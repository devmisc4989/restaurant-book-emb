import Ember from 'ember';

export default Ember.Component.extend({

  session: Ember.inject.service('session'),

  init() {
    this._super();
    var that = this;
    //this.send('test');
    io.socket.on("action", function(data) {
      that.send('notify', data);
    });
  },

  actions: {

    notify: function(data) {
      this.toast.info(JSON.stringify(data.message), '', {
        positionClass: 'toast-notification toast-notify'
      });
    },

    // test: function(data){
    //   this.toast.info('This is a test notification', '', {positionClass: 'toast-notification toast-notify'});
    // },

    toggle: function() {
      var collapsed = Ember.$("#mySidenav").hasClass("collapsed");
      if (collapsed) {
        document.getElementById("mySidenav").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
        document.getElementById("topnav").style.marginLeft = "200px";
        document.getElementById("subnav").style.marginLeft = "200px";


        Ember.$("#mySidenav").removeClass("collapsed");
      } else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("topnav").style.marginLeft = "0";
        document.getElementById("subnav").style.marginLeft = "0";
        Ember.$("#mySidenav").addClass("collapsed");
      }
    },

    fullScreen: function() {
      if (screenfull.enabled) {
        screenfull.toggle();
      } else {

      }
    },

    lockscreen: function() {
      console.log("running");
      this.get('router').transitionTo('lock-screen');
    },

    logoutModal: function() {
      $('#sign-out').modal('show');
    },

    logout: function() {
      $('#sign-out').modal('hide');
      this.get('session').invalidate();
      window.location.href = "/";
    },

  }

});
