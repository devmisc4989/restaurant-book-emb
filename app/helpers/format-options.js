import Ember from 'ember';

export function format(params) {
  console.log("hello");
  console.log(params[0]);
  if (params.length > 0) {
    var message;
    for (var i=0; i<params[0].length; i++) {
      if (i === 0) {
        message = ": ";
      } else {
        message = message + ", ";
      }
      message = message + params[0][i].description + " (" + params[0][i].amount + ")";
    }
    return message;
  } else {
      return "";
  }
}

export default Ember.Helper.helper(format);
