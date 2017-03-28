import Ember from 'ember';

export function format_time(date) {
	return moment(new Date(date)).format("h:mm A");
}

export default Ember.Helper.helper(format_time);
