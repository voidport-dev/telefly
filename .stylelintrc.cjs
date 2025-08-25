module.exports = {
  customSyntax: "@stylelint/postcss-css-in-js",
  extends: [
    "stylelint-config-standard"
  ],
  rules: {
    "unit-disallowed-list": ["dvh", "lvh", "svh"],
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["background"] }
    ],
    "selector-class-pattern": ["", {}],
    "media-feature-range-notation": null,
    "no-invalid-position-declaration": null,
    "nesting-selector-no-missing-scoping-root": null
  }
};


