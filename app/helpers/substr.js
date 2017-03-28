import Ember from 'ember';

export function substr(params) {
    if (params[0]) {
	    var theString = params[0].substr(params[1], params[2]);
        return Ember.String.htmlSafe(theString);
    } else {
        return "";
    }
}

export default Ember.Helper.helper(substr);
