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

  // tools/importer/parsers/tabs-warranty.js
  function parse(element, { document: document2 }) {
    let tabPanels = Array.from(element.querySelectorAll(":scope > .tab"));
    if (!tabPanels.length) tabPanels = Array.from(element.querySelectorAll(".tab"));
    if (!tabPanels.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const getLabelFromComment = (panel) => {
      let node = panel.previousSibling;
      while (node) {
        if (node.nodeType === 8) {
          const text = (node.textContent || "").trim().replace(/^-+|-+$/g, "").trim();
          if (text && !text.startsWith("##")) return text;
        }
        node = node.previousSibling;
      }
      return "";
    };
    const cells = [];
    tabPanels.forEach((panel, index) => {
      let label = getLabelFromComment(panel);
      if (!label) {
        const heading = panel.querySelector("h2, h3, h4");
        label = heading ? heading.textContent.trim().replace(/\s+/g, " ") : `Tab ${index + 1}`;
      }
      const contentNodes = Array.from(panel.childNodes).filter(
        (n) => n.nodeType === 1 || n.nodeType === 3 && n.textContent.trim()
      );
      const contentCell = contentNodes.length ? contentNodes : [panel];
      cells.push([label, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-warranty", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/widget.js
  function parse2(element, { document: document2 }) {
    const WIDGET_HREF = "/widgets/warranty-status.html";
    const labelEl = element.querySelector("dt, h2, h3, h4, .fs20");
    const linkText = labelEl && labelEl.textContent.trim() || "Warranty status";
    const link = document2.createElement("a");
    link.href = WIDGET_HREF;
    link.textContent = linkText;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "widget", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/natrellekorea-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#popUp_ver1",
        "#popUp_ver2",
        "#popUp_ver3",
        "#popUp_ver4"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#footer",
        "#topBtn",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/natrellekorea-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function firstSelector(section) {
    const sel = section.selector;
    if (Array.isArray(sel)) return sel[0];
    return sel;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const selector = firstSelector(section);
        if (!selector) continue;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(firstSelector(section));
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Natrelle Korea homepage \u2014 warranty program landing page with a status-lookup form, program details tabs, claim procedures, and footer info",
    urls: ["https://www.natrellekorea.co.kr/"],
    blocks: [
      {
        name: "section-hero",
        instances: ["#contents > div.background"],
        section: "hero-background"
      },
      {
        name: "widget",
        instances: ["#chkForm > div.main-top > dl"]
      },
      {
        name: "tabs-warranty",
        instances: ["#tab_wrap"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Hero background",
        selector: ["#contents > div.background"],
        style: "hero-background",
        blocks: [],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "Main content",
        selector: ["#tab_wrap"],
        style: null,
        blocks: ["tabs-warranty"],
        defaultContent: [
          "div.basic_in.compad_b > div.tab_content.pointCont > div.tab_in.noticeBox > p.stxt"
        ]
      }
    ]
  };
  var parsers = {
    "tabs-warranty": parse,
    widget: parse2
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [
        {
          element: main,
          path,
          report: {
            title: document2.title,
            template: PAGE_TEMPLATE.name,
            blocks: pageBlocks.map((b) => b.name)
          }
        }
      ];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
