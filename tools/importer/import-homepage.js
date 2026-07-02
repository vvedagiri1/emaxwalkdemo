/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters fashion blog homepage with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner',
  urls: [
    'https://wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'hero-blog',
      instances: ['#main-content > header.section.secondary-section'],
    },
    {
      name: 'columns-article',
      instances: ['#main-content > section.section:nth-of-type(1)'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div.faq-list', '.faq-list'],
    },
    {
      name: 'hero-overlay',
      instances: ['#main-content > section.section.inverse-section'],
    },
  ],
  sections: [
    {
      id: 'hero-header',
      name: 'Hero Header',
      selector: '#main-content > header.section.secondary-section',
      style: null,
      blocks: ['hero-blog'],
      defaultContent: [],
    },
    {
      id: 'featured-article',
      name: 'Featured Article',
      selector: '#main-content > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      selector: '#main-content > section.section.secondary-section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem'],
    },
    {
      id: 'testimonials-tabs',
      name: 'Testimonials Tabs',
      selector: '#main-content > section.section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: [],
    },
    {
      id: 'latest-articles',
      name: 'Latest Articles',
      selector: '#main-content > section.section.secondary-section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center'],
    },
    {
      id: 'faq-accordion',
      name: 'FAQ Accordion',
      selector: '#main-content > section.section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:first-child'],
    },
    {
      id: 'cta-banner',
      name: 'CTA Banner',
      selector: '#main-content > section.section.inverse-section',
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after parsing
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * De-duplicates elements matched by multiple selectors for the same block.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    const seen = new Set();
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block, skipping any element already replaced by an earlier parser
    const seenElements = new Set();
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      if (seenElements.has(block.element)) return;
      seenElements.add(block.element);
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
