import { helper } from '@ember/component/helper';

const mark = 'mark';
const wrap = (match) => `<${mark}>${match}</${mark}>`;

export function highlight([text, term]) {
  if (term && term.test(text)) {
    return text.replace(term, match => wrap(match))
  }
  return text;
}

export default helper(highlight);
