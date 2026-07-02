/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/
 * Container block: 2 columns, one row per item.
 *   Cell 1: summary (question).
 *   Cell 2: text (answer, richtext).
 * accordion-faq-item model fields: summary (text), text (richtext).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, details.faq-item, details'));

  // Empty-block guard
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // --- Cell 1: summary (question text) ---
    const summaryEl = item.querySelector('summary');
    const questionText = summaryEl
      ? (summaryEl.querySelector('span') ? summaryEl.querySelector('span').textContent.trim() : summaryEl.textContent.trim())
      : '';
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.appendChild(document.createTextNode(questionText));

    // --- Cell 2: text (answer, richtext) ---
    const answerEl = item.querySelector('.faq-answer');
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (answerEl) {
      Array.from(answerEl.childNodes).forEach((n) => textCell.appendChild(n));
    }

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
