import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  // This DA project serves authored content under /content. Fall back to the
  // /content-prefixed path when the default location isn't published.
  let fragment = await loadFragment(footerPath);
  if (!fragment && !footerMeta) {
    footerPath = '/content/footer';
    fragment = await loadFragment(footerPath);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  // The source footer is a single container split visually into two rows:
  // an upper company-info row (logo + company/contact details) and a lower
  // legal row (disclaimer, cookie notice, links, copyright), separated by a
  // divider. Regroup the authored paragraphs into those two rows so CSS can
  // lay them out. The legal row begins at the first paragraph that contains a
  // link (the legal links) or the long disclaimer/copyright text.
  // loadFragment wraps authored content in .section > .default-content-wrapper,
  // so target the innermost wrapper that directly holds the paragraphs.
  const wrapper = footer.querySelector('.default-content-wrapper')
    || footer.querySelector(':scope > div')
    || footer;
  const paras = [...wrapper.children].filter((el) => el.tagName === 'P');
  if (paras.length) {
    const legalStart = paras.findIndex((p, i) => i > 0
      && (p.querySelector('a') || /Copyright|상담 전화|웹사이트/.test(p.textContent)));
    const infoRow = document.createElement('div');
    infoRow.className = 'footer-info';
    const legalRow = document.createElement('div');
    legalRow.className = 'footer-legal';
    const cut = legalStart === -1 ? paras.length : legalStart;
    paras.forEach((p, i) => (i < cut ? infoRow : legalRow).append(p));

    // mark the logo paragraph for styling
    const logoP = infoRow.querySelector('p img')?.closest('p');
    if (logoP) logoP.classList.add('footer-logo');

    wrapper.replaceChildren(infoRow, legalRow);
  }

  block.append(footer);
}
