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
  /**
   * term can be a regex like:
   *
   *    1\.7 -> will match 1.7
   *    1.7 -> will match 127 since . is a wildcard
   *    er|si -> will match eric or simon
   *
   * @param term
   */
  filter(term) {
    this.setProperties({term});
    debounce(this, 'filterRows', 300);
  }
}
