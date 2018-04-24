import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import { visit, findAll, fillIn, triggerKeyEvent } from '@ember/test-helpers';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  function mockCsv(header, rows) {
    const csv = [header, ...rows].join('\n');

    return new Pretender(function() {
      this.get('/real-table.csv', () => [200, {}, csv]);
    });
  }

  test('show csv', async function(assert) {
    const header = 'name,dog name,power',
          rows   = ['dan bo ban,fido,500', 'eric mo meric,fluffy,250'],
          server = mockCsv(header, rows);

    await visit('/');

    assert.equal(findAll('.header.row').length, 1, "shows header row");
    assert.equal(findAll('.data.row').length, rows.length, "shows all data rows");

    server.shutdown();
  });

  test('search csv', async function(assert) {
    const header = 'name,dog name,power',
          rows   = ['dan bo ban,fido,500', 'eric mo meric,fluffy,250'],
          server = mockCsv(header, rows);

    await visit('/');
    await fillIn('.search input', 'an');
    await triggerKeyEvent('.search input', 'keyup', 10);

    assert.equal($('.data.row:visible').length, 1, "one matching row for term 'an'");
    assert.equal(findAll('mark').length, 2, "two hits on row for term 'an'");

    server.shutdown();
  });
});
