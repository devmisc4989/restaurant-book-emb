import Ember from 'ember';

export function isempty(param) {
  if (param[0].length < 1) {
        return true;
    } else {
        return false;
    }
}

export default Ember.Helper.helper(isempty);
