/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/
 * Container block: one row per card, 2 cells (cell1 image, cell2 text).
 * card model fields: image (reference), text (richtext).
 * Each card is an <a> link wrapping an image + body (tag, date, title).
 */
export default function parse(element, { document }) {
  // Each card is a top-level <a class="article-card"> (fallback to direct div children).
  let cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));
  if (cardEls.length === 0) {
    cardEls = Array.from(element.querySelectorAll(':scope > a, :scope > div'));
  }

  // Empty-block guard
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cardEls.forEach((cardEl) => {
    const href = cardEl.getAttribute('href');
    const img = cardEl.querySelector('img');

    // --- Cell 1: image ---
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // --- Cell 2: text (tag, date, title) ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const tag = cardEl.querySelector('.tag');
    const date = cardEl.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    const title = cardEl.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');

    // Meta line (tag + date) as a paragraph.
    if (tag || date) {
      const metaP = document.createElement('p');
      if (tag) metaP.appendChild(tag);
      if (tag && date) metaP.appendChild(document.createTextNode(' '));
      if (date) metaP.appendChild(date);
      textCell.appendChild(metaP);
    }

    // Title as a heading; wrap in the card link to preserve the article URL.
    if (title) {
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title.textContent.trim();
        const h = document.createElement('h3');
        h.appendChild(a);
        textCell.appendChild(h);
      } else {
        textCell.appendChild(title);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
