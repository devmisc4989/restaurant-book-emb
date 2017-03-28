import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('booking-feedback', 'Integration | Component | booking feedback', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{booking-feedback}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#booking-feedback}}
      template block text
    {{/booking-feedback}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
