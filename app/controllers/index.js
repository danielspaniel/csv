import Controller from '@ember/controller';
import { reads } from '@ember-decorators/object/computed';
import { action } from '@ember-decorators/object';
import { debounce } from '@ember/runloop';
import { isPresent } from '@ember/utils';

export default class extends Controller {
  rowHeight = 40;
  columns = [100];

  @reads('filteredRows.length') totalRows

  filterRows() {
    let filteredRows = this.rows, regexTerm;
    if (isPresent(this.term)) {
      regexTerm = new RegExp(this.term, 'ig');
      filteredRows = this.rows.filter(row => regexTerm.test(row.join(' ')));
    }
    this.setProperties({filteredRows, regexTerm});
  }

  @action
  toggleShowHighlight() {
    this.toggleProperty('showHighlight')
  }

  @action
  filter(term) {
    this.setProperties({term});
    debounce(this, 'filterRows', 300);
  }
}
