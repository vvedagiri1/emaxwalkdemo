/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * xwalk model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Library structure: 1 column, 3 rows -> [name], [image], [text].
 * Full-bleed banner: background image + overlaid heading, subheading, single CTA.
 */
export default function parse(element, { document }) {
  // Background image (the cover/overlay image, not any content-body image).
  const bgImage = element.querySelector('img.utility-overlay, img.cover-image, img[class*="overlay"], img');

  // Overlaid text content: heading, subheading, CTA.
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image with field hint
  const imageCell = document.createDocumentFragment();
  if (bgImage) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
  }
  cells.push([imageCell]);

  // Row 3: text content with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctaLinks.forEach((a) => textCell.appendChild(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
