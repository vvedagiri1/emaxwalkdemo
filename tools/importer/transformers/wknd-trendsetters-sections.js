/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks + section metadata.
 *
 * Runs in afterTransform only. Uses payload.template.sections to:
 *   - insert an <hr> before every section except the first (section breaks)
 *   - append a "Section Metadata" block for every section that has a style
 *
 * Section selectors come from tools/importer/page-templates.json (derived from
 * the captured DOM). Selectors are anchored on "#main-content > ...". The
 * transformer runs against the main (#main-content) element, so we strip the
 * "#main-content >" prefix and resolve each section relative to `element`.
 *
 * Template has 7 sections; 2 have style "secondary".
 *   Expected <hr>: 6 (sections.length - 1)
 *   Expected Section Metadata blocks: 2
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function resolveSection(element, selector) {
  if (!selector) return null;
  // First try the selector as-is (works when element is the #main-content root).
  let el = null;
  try {
    el = element.querySelector(selector);
  } catch (e) {
    el = null;
  }
  if (el) return el;
  // Fallback: strip a leading "#main-content >" prefix and match relative to element.
  const relative = selector.replace(/^#main-content\s*>\s*/, ':scope > ');
  try {
    el = element.querySelector(relative);
  } catch (e) {
    el = null;
  }
  return el;
}

export default function transform(hookName, element, payload) {
  // Run in beforeTransform: section elements are still intact here. If we waited
  // until afterTransform, block parsers would have already replaced several
  // <section> elements (hero-blog, columns-article, hero-overlay) via
  // replaceWith, so their selectors would no longer resolve. The <hr> and
  // Section Metadata nodes inserted here are siblings and survive those
  // replacements.
  if (hookName === TransformHook.beforeTransform) {
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process in reverse so earlier insertions don't disturb later section lookups.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolveSection(element, section.selector);
      if (!sectionEl) continue;

      // Section Metadata block for styled sections, appended after the section.
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(block);
      }

      // Section break before every non-first section.
      if (i > 0) {
        sectionEl.before(document.createElement('hr'));
      }
    }
  }
}
