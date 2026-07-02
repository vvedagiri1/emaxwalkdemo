/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-blog. Base: hero.
 * Source: https://wknd-trendsetters.site/
 * xwalk model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Library structure: 1 column, 3 rows -> [name], [image], [text].
 */
export default function parse(element, { document }) {
  // Text content column: heading, subheading, CTA buttons
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Image column: cover/hero images
  const images = Array.from(element.querySelectorAll('img.cover-image, img[class*="cover"], img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image(s) with field hint
  const imageCell = document.createDocumentFragment();
  if (images.length > 0) {
    imageCell.appendChild(document.createComment(' field:image '));
    images.forEach((img) => imageCell.appendChild(img));
  }
  cells.push([imageCell]);

  // Row 3: text content (title/subheading/CTA) with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctaLinks.forEach((a) => textCell.appendChild(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
