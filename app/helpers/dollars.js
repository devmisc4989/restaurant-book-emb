import Ember from 'ember';

export function dollars(cents) {
	return (parseInt(cents) / 100).toFixed(2);
}

export default Ember.Helper.helper(dollars);
