/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-blog.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll('img.cover-image, img[class*="cover"], img'));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    if (images.length > 0) {
      imageCell.appendChild(document.createComment(" field:image "));
      images.forEach((img) => imageCell.appendChild(img));
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctaLinks.forEach((a) => textCell.appendChild(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const grid = element.querySelector(".grid-layout") || element.querySelector(".container") || element;
    let columns = Array.from(grid.querySelectorAll(":scope > div"));
    if (columns.length < 2) {
      const container = element.querySelector(".container") || element;
      columns = Array.from(container.querySelectorAll(":scope > div > div"));
    }
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push(columns);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > div"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((cardEl) => {
      const img = cardEl.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu-link"));
    if (panes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      const menu = menuButtons[i];
      const labelCell = document.createDocumentFragment();
      let labelText = "";
      if (menu) {
        const nameEl = menu.querySelector("strong");
        if (nameEl) labelText = nameEl.textContent.trim();
      }
      if (!labelText) {
        const paneName = pane.querySelector("strong");
        if (paneName) labelText = paneName.textContent.trim();
      }
      labelCell.appendChild(document.createComment(" field:title "));
      labelCell.appendChild(document.createTextNode(labelText));
      const contentCell = document.createDocumentFragment();
      const img = pane.querySelector("img");
      if (img) {
        contentCell.appendChild(document.createComment(" field:content_image "));
        contentCell.appendChild(img);
      }
      const nameBlock = pane.querySelector('.paragraph-xl.utility-margin-bottom-0, [class*="paragraph-xl"] strong');
      const roleEl = nameBlock ? nameBlock.closest("div").parentElement.querySelectorAll(":scope > div")[1] : null;
      contentCell.appendChild(document.createComment(" field:content_heading "));
      const nameStrong = pane.querySelector("strong");
      if (nameStrong) {
        const h = document.createElement("h3");
        h.textContent = nameStrong.textContent.trim();
        contentCell.appendChild(h);
      }
      contentCell.appendChild(document.createComment(" field:content_richtext "));
      if (roleEl) contentCell.appendChild(roleEl);
      const quote = pane.querySelector("p");
      if (quote) contentCell.appendChild(quote);
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    let cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    if (cardEls.length === 0) {
      cardEls = Array.from(element.querySelectorAll(":scope > a, :scope > div"));
    }
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((cardEl) => {
      const href = cardEl.getAttribute("href");
      const img = cardEl.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const tag = cardEl.querySelector(".tag");
      const date = cardEl.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      const title = cardEl.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (tag || date) {
        const metaP = document.createElement("p");
        if (tag) metaP.appendChild(tag);
        if (tag && date) metaP.appendChild(document.createTextNode(" "));
        if (date) metaP.appendChild(date);
        textCell.appendChild(metaP);
      }
      if (title) {
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title.textContent.trim();
          const h = document.createElement("h3");
          h.appendChild(a);
          textCell.appendChild(h);
        } else {
          textCell.appendChild(title);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, details.faq-item, details"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summaryEl = item.querySelector("summary");
      const questionText = summaryEl ? summaryEl.querySelector("span") ? summaryEl.querySelector("span").textContent.trim() : summaryEl.textContent.trim() : "";
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.appendChild(document.createTextNode(questionText));
      const answerEl = item.querySelector(".faq-answer");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (answerEl) {
        Array.from(answerEl.childNodes).forEach((n) => textCell.appendChild(n));
      }
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.utility-overlay, img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(bgImage);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctaLinks.forEach((a) => textCell.appendChild(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // skip-to-main-content link
        ".navbar",
        // top nav bar, logo, mega-menu, mobile menu toggle
        "footer.footer",
        // site footer
        ".breadcrumbs"
        // breadcrumb navigation (site chrome, not article content)
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function resolveSection(element, selector) {
    if (!selector) return null;
    let el = null;
    try {
      el = element.querySelector(selector);
    } catch (e) {
      el = null;
    }
    if (el) return el;
    const relative = selector.replace(/^#main-content\s*>\s*/, ":scope > ");
    try {
      el = element.querySelector(relative);
    } catch (e) {
      el = null;
    }
    return el;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const template = payload && payload.template;
      const sections = template && template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = resolveSection(element, section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const block = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(block);
        }
        if (i > 0) {
          sectionEl.before(document.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters fashion blog homepage with hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-blog",
        instances: ["#main-content > header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1)"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div.faq-list", ".faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["#main-content > section.section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "hero-header",
        name: "Hero Header",
        selector: "#main-content > header.section.secondary-section",
        style: null,
        blocks: ["hero-blog"],
        defaultContent: []
      },
      {
        id: "featured-article",
        name: "Featured Article",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "image-gallery",
        name: "Image Gallery",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "testimonials-tabs",
        name: "Testimonials Tabs",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "latest-articles",
        name: "Latest Articles",
        selector: "#main-content > section.section.secondary-section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"]
      },
      {
        id: "faq-accordion",
        name: "FAQ Accordion",
        selector: "#main-content > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:first-child"]
      },
      {
        id: "cta-banner",
        name: "CTA Banner",
        selector: "#main-content > section.section.inverse-section",
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-blog": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      const seen = /* @__PURE__ */ new Set();
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      const seenElements = /* @__PURE__ */ new Set();
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
