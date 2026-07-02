/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/
 * Container block: 2 columns, one row per tab.
 *   Cell 1: Tab Label (title field).
 *   Cell 2: Tab Content -> grouped content_* fields:
 *           content_image (image), content_heading (name/role), content_richtext (quote).
 *   content_headingType is a collapsed (Type) field -> no comment.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link'));

  // Empty-block guard
  if (panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panes.forEach((pane, i) => {
    const menu = menuButtons[i];

    // --- Cell 1: Tab Label (title) ---
    const labelCell = document.createDocumentFragment();
    // Derive the tab label text from the menu button's name (first bold line), else the pane name.
    let labelText = '';
    if (menu) {
      const nameEl = menu.querySelector('strong');
      if (nameEl) labelText = nameEl.textContent.trim();
    }
    if (!labelText) {
      const paneName = pane.querySelector('strong');
      if (paneName) labelText = paneName.textContent.trim();
    }
    labelCell.appendChild(document.createComment(' field:title '));
    labelCell.appendChild(document.createTextNode(labelText));

    // --- Cell 2: Tab Content (content_image, content_heading, content_richtext) ---
    const contentCell = document.createDocumentFragment();
    const img = pane.querySelector('img');
    if (img) {
      contentCell.appendChild(document.createComment(' field:content_image '));
      contentCell.appendChild(img);
    }

    // Heading: person name + role block (first inner div group in the pane's text column)
    const nameBlock = pane.querySelector('.paragraph-xl.utility-margin-bottom-0, [class*="paragraph-xl"] strong');
    const roleEl = nameBlock
      ? (nameBlock.closest('div').parentElement.querySelectorAll(':scope > div')[1])
      : null;
    contentCell.appendChild(document.createComment(' field:content_heading '));
    // Build a heading from the person name (strong) as the content heading.
    const nameStrong = pane.querySelector('strong');
    if (nameStrong) {
      const h = document.createElement('h3');
      h.textContent = nameStrong.textContent.trim();
      contentCell.appendChild(h);
    }

    // Richtext: role line + quote paragraph.
    contentCell.appendChild(document.createComment(' field:content_richtext '));
    if (roleEl) contentCell.appendChild(roleEl);
    const quote = pane.querySelector('p');
    if (quote) contentCell.appendChild(quote);

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
