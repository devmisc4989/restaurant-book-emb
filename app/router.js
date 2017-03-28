import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('404', { path: '/*path' });
  this.route('register');
  this.route('dashboard');
  this.route('profile');
  this.route('restaurants');
  this.route('restaurant', { path: '/restaurant/:id' });
  this.route('access', { path: '/access/:id' });
  this.route('menus');
  this.route('bookings');
  this.route('menu', function() {
    this.route('overview');
    this.route('details', { path: '/details/:id' });
    this.route('settings', { path: '/settings/:id' });
  });
  this.route('bookingtypes');
  this.route('booking', function() {
    this.route('details', { path: '/details/:id' });
    this.route('overview');
    this.route('menu', { path: '/menu/:id/:input_index/:menu_index' });
  });
  this.route('verify-account');
  this.route('verify');
  this.route('reset');
  this.route('reset-password');
  this.route('password-reset');
  this.route('managed-apps');
  this.route('lock-screen');
});

export default Router;
