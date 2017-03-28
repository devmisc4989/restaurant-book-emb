import Ember from 'ember';

export function if_last(params) {
  if (parseInt(params[0]) == (params[1].length - 1)) {
        return true;
    } else {
        return false;
    }
}

export default Ember.Helper.helper(if_last);
