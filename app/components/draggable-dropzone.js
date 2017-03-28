import Ember from 'ember';

var {
  set
} = Ember;

var {
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['draggableDropzone'],
  classNameBindings: ['dragClass'],
  dragClass: 'deactivated',

  dragLeave(event) {
    event.preventDefault();
    set(this, 'dragClass', 'deactivated');
  },

  dragOver(event) {
    event.preventDefault();
    set(this, 'dragClass', 'activated');
  },

  drop(event) {
    var new_index = get(this, 'content');
    var params = event.dataTransfer.getData('text/data');
    params = JSON.parse(params);
    var data = {
      old_index: params.old_index,
      items: params.items,
      new_index: new_index
    };

    this.sendAction('dropped', data);

    set(this, 'dragClass', 'deactivated');
  }
});
