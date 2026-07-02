/**
 * loads and decorates the hero-blog block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const [imageCell, textCell] = block.children;

  if (imageCell) imageCell.classList.add('hero-blog-images');
  if (textCell) textCell.classList.add('hero-blog-content');
}
