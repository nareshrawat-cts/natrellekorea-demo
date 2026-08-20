/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Natrelle Korea site-wide cleanup.
 * Removes non-authorable content (cookie overlay, footer, click-to-open detail
 * modals, back-to-top button, stray link tags) so the import contains only
 * page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays/modals that would interfere with block parsing (cleaned.html):
    //   #onetrust-consent-sdk  -> OneTrust cookie consent banner/overlay (line 746)
    //   #popUp_ver1..4         -> click-to-open definition modals off Tab 1 (lines 619-683)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#popUp_ver1',
      '#popUp_ver2',
      '#popUp_ver3',
      '#popUp_ver4',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome / leftover elements (cleaned.html):
    //   #footer   -> site footer fragment (line 685), handled by footer migration
    //   #topBtn   -> back-to-top button (line 734)
    //   link      -> stray stylesheet link tag (line 743)
    //   noscript  -> safe to drop
    WebImporter.DOMUtils.remove(element, [
      '#footer',
      '#topBtn',
      'link',
      'noscript',
    ]);
  }
}
