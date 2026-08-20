/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Natrelle Korea section breaks and Section Metadata.
 *
 * Template `homepage` has 2 sections (page-templates.json):
 *   rc1 "Hero background"  selector "#contents > div.background"    style "hero-background"
 *   rc2 "Main content"     selector "#contents > div.contents_in"  style null
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists, before parsers can replace them) using a temporary marker attribute;
 * Section Metadata blocks are inserted in afterTransform anchored to that
 * marker. Sections are processed in reverse so live-element inserts never shift
 * elements we have not yet handled. See references/generate-import-transformer.md.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is authored as an array in page-templates.json.
function firstSelector(section) {
  const sel = section.selector;
  if (Array.isArray(sel)) return sel[0];
  return sel;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section w/o style: no break, no metadata
      const selector = firstSelector(section);
      if (!selector) continue;
      const sectionEl = element.querySelector(selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr> placed above, or (first section, no marker) the original element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(firstSelector(section));
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
