import Route from '@ember/routing/route';
import $ from 'jquery';

export default class Index extends Route {

  model() {
    return $.get({url: '/real-table.csv', dataType: "text"})
  }

  setupController(controller, csv) {
    super.setupController(...arguments);

    const {header, rows} = this.extractData(csv),
          columnWidths   = this.getColumnWidths(rows);
    this.createStyleSheet(columnWidths);

    controller.setProperties({header, rows, filteredRows: rows});
  }

  extractData(csv) {
    const data              = csv.split(/\n/).map(r => r.split(',')),
          [header, ...rows] = data;

    return {header, rows};
  }

  /**
   * This strattegy of calculating column widths to create a nice looking
   * table like view is fast, and scales to about 5 thousand rows. But for
   * tens of thousands I would probably have to use another strategy.
   *
   * Using a table and tr/td tags normally would work fine and this would
   * not be needed, except that when using buffering ( not showing all rows )
   * the table resizes itself based on the current td sizes and therefore
   * when scrolling and showing new rows the experience is choppy.
   *
   * With this strategy the scroll view is fast, and smooth to the eye, because
   * the column widths are fixed.
   *
   * @param rows
   */
  getColumnWidths(rows) {
    const canvas   = document.createElement('canvas'),
          ctx      = canvas.getContext("2d"),
          font     = "12px Arial",
          sizes    = {},
          minWidth = 30;

    ctx.font = font;

    rows.forEach(row => {
      row.forEach((column, index) => {
        if (!sizes[index]) {
          sizes[index] = minWidth;
        }
        let len = Math.round(ctx.measureText(String(column)).width);
        if (len > sizes[index]) {
          sizes[index] = len;
        }
      });
    });
    return sizes;
  }

  /**
   * Create a style sheet for the columns in the csv, with a style defining
   * a width for each column.
   *
   * Doing this makes is super simple to set the style on the rows
   *
   * @param sizes
   */
  createStyleSheet(sizes) {
    let style       = document.createElement('style'),
        total       = 0,
        columnScale = 2,
        totalScale  = 1.05,
        newStyles   = [];

    Object.keys(sizes).forEach((key, index) => {
      const width = sizes[key];
      total += (width * columnScale);
      newStyles.push(`.col-${index} { width: ${width * columnScale}px; }`);
    });
    newStyles.push(`.total-width { width: ${total * totalScale}px; }`);

    style.innerHTML = newStyles.join('\n');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
  }
}
