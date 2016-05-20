'use strict';

module.exports = {
  rules: {
    'no-explicit-directory-imports': require('./rules/no-explicit-directory-imports'),
    'no-relative-imports': require('./rules/no-relative-imports'),
    'spread-jsx': require('./rules/spread-jsx'),
    'sort-imports': require('./rules/sort-imports'),
  },
};
