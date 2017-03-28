import Ember from 'ember';

export function header() {

    var location = window.location.href.split("/")[3];

    var title;

    switch (location) {
      case "menu":
          title = "MENU";
          break;
      case "menus":
          title = "MENUS";
          break;
      case "bookings":
          title = "BOOKINGS";
          break;
      case "restaurants":
          title = "RESTAURANTS";
          break;
      case "restaurant":
          title = "RESTAURANT";
          break;
      case "access":
          title = "RESTAURANT";
          break;
      case "booking":
          title = "BOOKING";
          break;
      case "profile":
          title = "SETTINGS";
          break;
      case "managed-apps":
          title = "SETTINGS";
          break;
      default:
          title = "DASHBOARD";
    }

    return title;
}

export default Ember.Helper.helper(header);
