import Ember from 'ember';

export function math(params) {

	var result;

	switch (params[2]) {
			case '+':
					result = params[0] + params[1];
					break;
			case '-':
					result = params[0] - params[1];
					break;
			case '*':
					result = params[0] * params[1];
					break;
			case '/':
					result = params[0] / params[1];
					break;
	}

	return result;

}

export default Ember.Helper.helper(math);
