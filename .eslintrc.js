module.exports = {
  "extends": ["standard", "plugin:react/recommended"],
  "plugins": [
      "standard",
      "promise",
      "react",
      "react-hooks"
  ],
  "settings": {
      "react": {
          "version": "detect"
      }
  },
  "env": {
      "browser": true,
      "mocha": true,
      "node": true,
      "jest": true,
  },
  "rules": {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "space-before-function-paren": ["error", {
          "anonymous": "never",
          "named": "never",
          "asyncArrow": "always"
      }],
      "no-multiple-empty-lines": 0,
      "generator-star-spacing": ["error", {"before": false, "after": true}],
      "array-bracket-spacing": 0,
      "object-curly-spacing": 0,
      "space-in-parens": 0,
      "spaced-comment": 0,
      "padded-blocks": 0,
      "comma-dangle": ["error", "only-multiline"],
      "quote-props": 0,
      "camelcase": 0,
      "operator-linebreak": 0,
      "indent": 0,
      "eqeqeq": 0,
      "curly": 0,
      "semi": 0,
      "no-tabs": 0,
      "no-void": 0,
      "no-mixed-operators": 0,
  }
};
