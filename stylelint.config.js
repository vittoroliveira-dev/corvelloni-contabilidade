// stylelint.config.js
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["docs/**", "node_modules/**"],
  rules: {
    // BEM (.c-*, .o-*, .u-* com __ e --)
    "selector-class-pattern": [
      "^(?:[a-z](?:[a-z0-9-]*))(?:__(?:[a-z0-9-]+))?(?:--(?:[a-z0-9-]+))?$",
      { message: "Use BEM: block__element--modifier (lowercase, digits, dashes)." }
    ],
    // ↓ Desativa, pois está gerando falsos positivos nas variáveis CSS
    "custom-property-pattern": null,

    "property-no-vendor-prefix": null,
    "color-function-notation": "legacy",
    "alpha-value-notation": "number",
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "rule-empty-line-before": null,
    "media-feature-range-notation": "prefix",
    "value-keyword-case": [
      "lower",
      {
        ignoreProperties: ["font-family", "text-rendering"],
        ignoreKeywords: ["currentColor","BlinkMacSystemFont","Roboto","Helvetica","Arial"]
      }
    ],
    "declaration-block-no-redundant-longhand-properties": null
  }
};
