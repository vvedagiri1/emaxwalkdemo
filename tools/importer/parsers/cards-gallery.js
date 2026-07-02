/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Container block: one row per card, 2 cells (cell1 image, cell2 text).
 * These cards are image-only, so the text cell is left empty (no hint on empty cells).
 * card model fields: image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  // Each card is a direct child cell in the grid.
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cardEls.forEach((cardEl) => {
    const img = cardEl.querySelector('img');

    // Cell 1: image with field hint
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Cell 2: text content (empty for image-only cards -> no hint)
    const textCell = document.createDocumentFragment();

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
