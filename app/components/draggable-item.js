import Ember from 'ember';

var {
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['draggableItem'],
  attributeBindings: ['draggable'],
  draggable: 'true',

  dragStart(event) {

    var data = {
      old_index: get(this, 'content'),
      items: get(this, 'items')
    };
    data = JSON.stringify(data);
    return event.dataTransfer.setData('text/data', data);
  }
});
