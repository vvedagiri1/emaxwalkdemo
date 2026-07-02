/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors below are taken directly from the captured
 * DOM in migration-work/cleaned.html (static Astro-generated site).
 *
 * Non-authorable elements found in captured DOM:
 *   - <a class="skip-link">           accessibility skip-to-content link
 *   - <div class="navbar">            top navigation / logo / mega-menu / mobile toggle
 *   - <footer class="footer ...">     site footer (social icons + link columns)
 *   - <div class="breadcrumbs">       breadcrumb nav inside the featured article section
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Nothing blocks block parsing on this static page (no cookie banners,
    // modals, or overlays present in the captured DOM).
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (selectors verified in cleaned.html).
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',       // skip-to-main-content link
      '.navbar',          // top nav bar, logo, mega-menu, mobile menu toggle
      'footer.footer',    // site footer
      '.breadcrumbs',     // breadcrumb navigation (site chrome, not article content)
    ]);
  }
}
