/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-warranty
 * Base block: tabs (Block Collection)
 * Source: https://www.natrellekorea.co.kr/ (#tab_wrap)
 * Generated: 2026-08-18
 *
 * Structure (from library-description.txt): 2 columns per row.
 *   Row 1 = block name (handled by createBlock).
 *   Each subsequent row = one tab: cell 1 = tab label, cell 2 = full tab content.
 *
 * Source specifics: #tab_wrap has 5 direct-child `.tab` divs, each holding one
 * tab's full content panel. The human-readable tab label is NOT rendered inside
 * the panel — it lives in the HTML comment immediately preceding each `.tab`
 * div (e.g. `<!---- 보증 프로그램 및 청구 절차 ---->`). We extract the label from
 * that preceding comment, skipping closing comments that start with `##`.
 */
export default function parse(element, { document }) {
  // Direct-child tab panels (fallback to any descendant .tab if structure varies)
  let tabPanels = Array.from(element.querySelectorAll(':scope > .tab'));
  if (!tabPanels.length) tabPanels = Array.from(element.querySelectorAll('.tab'));

  // Empty-block guard
  if (!tabPanels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Resolve the tab label for a panel from the nearest preceding comment node.
  const getLabelFromComment = (panel) => {
    let node = panel.previousSibling;
    while (node) {
      if (node.nodeType === 8) {
        const text = (node.textContent || '').trim().replace(/^-+|-+$/g, '').trim();
        // Skip closing markers like "##보증 프로그램 및 청구 절차"
        if (text && !text.startsWith('##')) return text;
      }
      node = node.previousSibling;
    }
    return '';
  };

  const cells = [];

  tabPanels.forEach((panel, index) => {
    // 1) Tab label: preferred from preceding comment, fallback to first heading, then generic.
    let label = getLabelFromComment(panel);
    if (!label) {
      const heading = panel.querySelector('h2, h3, h4');
      label = heading ? heading.textContent.trim().replace(/\s+/g, ' ') : `Tab ${index + 1}`;
    }

    // 2) Tab content: everything inside the panel (preserve semantic HTML).
    const contentNodes = Array.from(panel.childNodes).filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()),
    );
    const contentCell = contentNodes.length ? contentNodes : [panel];

    // 2-column row: [label, content]
    cells.push([label, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-warranty', cells });
  element.replaceWith(block);
}
