/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget
 * Base block: widget (local project utility loader — not a vanilla Block Collection block)
 * Source: https://www.natrellekorea.co.kr/ (#chkForm > div.main-top > dl)
 * Generated: 2026-08-18
 *
 * Per authoring-analysis: the `widget` block is a project utility that loads bespoke
 * interactive HTML/CSS/JS (the warranty-status lookup form) from /widgets/ at runtime.
 * The interactive name/birthdate inputs + submit button seen in the source `dl` are
 * therefore NOT authored inline. Instead the block table holds a single authored link
 * to the widget asset (e.g. /widgets/warranty-status.html). Structure: single-column,
 * one row, one cell containing one link.
 */
export default function parse(element, { document }) {
  // The widget asset path this block loads at runtime.
  const WIDGET_HREF = '/widgets/warranty-status.html';

  // Prefer the source label (e.g. the "보증 상태조회" heading) for the link text so the
  // authored link is meaningful; fall back to a generic label.
  const labelEl = element.querySelector('dt, h2, h3, h4, .fs20');
  const linkText = (labelEl && labelEl.textContent.trim()) || 'Warranty status';

  const link = document.createElement('a');
  link.href = WIDGET_HREF;
  link.textContent = linkText;

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'widget', cells });
  element.replaceWith(block);
}
