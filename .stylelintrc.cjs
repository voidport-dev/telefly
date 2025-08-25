module.exports = {
  customSyntax: "@stylelint/postcss-css-in-js",
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ],
  rules: {
    "unit-disallowed-list": ["dvh", "lvh", "svh"],
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["background"] }
    ],
    "selector-class-pattern": ["", {}],
    "media-feature-range-notation": null
  }
};


