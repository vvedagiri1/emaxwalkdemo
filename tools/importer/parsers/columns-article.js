/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/
 * Columns block (core/franklin/components/columns) - 2 columns, 1 row.
 * NOTE: Columns blocks do NOT use field:* hint comments (per xwalk hinting rules).
 */
export default function parse(element, { document }) {
  // The two columns live as direct child <div>s inside the grid-layout container.
  const grid = element.querySelector('.grid-layout') || element.querySelector('.container') || element;
  let columns = Array.from(grid.querySelectorAll(':scope > div'));

  // Fallback: if the grid wrapper wasn't matched, try direct children of container.
  if (columns.length < 2) {
    const container = element.querySelector('.container') || element;
    columns = Array.from(container.querySelectorAll(':scope > div > div'));
  }

  // Empty-block guard
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push(columns);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
