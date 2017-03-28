import Ember from 'ember';

export function if_eq(params) {
  if (params[0] == params[1]) {
        return true;
    } else {
        return false;
    }
}

export default Ember.Helper.helper(if_eq);
