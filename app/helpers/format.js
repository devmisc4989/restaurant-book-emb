import Ember from 'ember';

export function format(date) {
	return moment(new Date(date)).format("MMMM Do YYYY");
}

export default Ember.Helper.helper(format);
