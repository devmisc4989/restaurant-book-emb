import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ryan-preloader', 'Integration | Component | ryan preloader', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ryan-preloader}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ryan-preloader}}
      template block text
    {{/ryan-preloader}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
