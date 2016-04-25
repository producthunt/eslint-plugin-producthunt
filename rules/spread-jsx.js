/**
 * Error message that ESLint will use.
 */

var ERROR_MESSAGE = 'Avoid the spread operator in JSX';

/**
 * Detect the spread operator in JSX expressions and
 * report as a problem.
 *
 * @param {Object} eslint context
 * @public
 */

module.exports = function(context) {
  var nodes = [];

  return {
    JSXSpreadAttribute: function(node) {
      nodes.push(node);
    },

   'Program:exit': function() {
     nodes.forEach(function(node) {
       context.report(node, ERROR_MESSAGE)
     });
   },
  };
};
