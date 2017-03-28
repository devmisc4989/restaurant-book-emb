import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('booking-pending', 'Integration | Component | booking pending', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{booking-pending}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#booking-pending}}
      template block text
    {{/booking-pending}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
